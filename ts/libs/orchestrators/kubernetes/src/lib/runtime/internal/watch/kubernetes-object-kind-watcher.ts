import { KubeConfig, KubernetesObject, Watch } from '@kubernetes/client-node';
import {
    ApiObject,
    Logger,
    ObjectKind,
    ObjectKindNotFoundError,
    ObjectKindPropertiesMissingError,
    ObjectKindWatcher,
    ObjectKindWatcherError,
    PolarisTransformationService,
    WatchAlreadyStartedError,
    WatchEventsHandler,
    WatchTerminatedError,
    convertToNumber,
    getEnvironmentVariable,
} from '@polaris-sloc/core';

const REQUIRED_OBJECT_KIND_PROPERTIES: (keyof ObjectKind)[] = [ 'version', 'kind' ];

/**
 * Temporary solution for undetected watch disconnects.
 * If this env var is set to a positive number, a periodic connection check heuristic will be executed.
 * See `setupConnectionWatchHeuristic()` for details.
 */
const CONNECTION_CHECK_TIMEOUT_ENV_VAR = 'POLARIS_CONNECTION_CHECK_TIMEOUT_MS';

// Unfortunately @kubernetes/client-node does not provide these typings, so we need to define them ourselves.
type WatchEventType = 'ADDED' | 'MODIFIED' | 'DELETED' | 'BOOKMARK';

interface WatchRequest {
    abort(): void;
}

/**
 * Kubernetes-specific implementation of te `ObjectKindWatcher`.
 */
export class KubernetesObjectKindWatcher implements ObjectKindWatcher {

    private watchReq: WatchRequest;
    private _kind: ObjectKind;
    private _handler: WatchEventsHandler;

    // The timestamp when we last received an event form the watch.
    // See setupConnectionWatchHeuristic()
    private lastEventReceivedTimestamp: number;
    private connectionCheckInterval: NodeJS.Timeout;

    get isActive(): boolean {
        return !!this.watchReq && !!this._kind && !!this._handler;
    }

    get kind(): ObjectKind {
        return this._kind;
    }

    get handler(): WatchEventsHandler {
        return this._handler;
    }

    constructor(
        private kubeConfig: KubeConfig,
        private transformer: PolarisTransformationService,
    ) { }

    async startWatch(kind: ObjectKind, handler: WatchEventsHandler<any>): Promise<void> {
        if (this.isActive) {
            throw new WatchAlreadyStartedError(this);
        }
        this.checkIfRequiredPropsArePresent(kind);

        this._kind = kind;
        this._handler = handler;
        const watch = new Watch(this.kubeConfig);
        const path = this.getWatchPath(kind);

        // watch() returns a request object which can be used to abort the watch.
        const watchReq: WatchRequest = await watch.watch(
            path,
            {
                allowWatchBookmarks: false,
            },
            (type: WatchEventType, k8sObj: KubernetesObject) => this.onK8sWatchCallbackEvent(type, k8sObj),
            (err) => {
                // This is the done callback.
                // It is called if the watch terminates normally and if there is an error.
                let watchErr: ObjectKindWatcherError;
                if (err) {
                    if ((err as Error)?.message === 'Not Found') {
                        // Unfortunately this error usually occurs after the watch has started successfully,
                        // so we most likely need to pass it to onError() instead of rejecting the promise.
                        watchErr = new ObjectKindNotFoundError(this, kind);
                    } else {
                        watchErr = new WatchTerminatedError(this, err);
                    }
                } else {
                    // err is undefined or null, so the library reports this as a normal termination of the watch.
                    // However, if this.watchReq is set, then the termination was not requested by us,
                    // so we treat it as an error.
                    if (this.watchReq) {
                        watchErr = new WatchTerminatedError(this, err);
                    }
                }
                if (watchErr) {
                    // If the promise has already resolved, pass the error to onError(),
                    // otherwise reject the promise.
                    if (this.isActive) {
                        this.handler.onError(watchErr);
                    } else {
                        throw watchErr;
                    }
                }
                this.watchReq = null;
                this.stopWatch();
            },
        );

        Logger.log(`Started watch on ${path}`);
        this.watchReq = watchReq;
        this.setupConnectionWatchHeuristic();
    }

    stopWatch(): void {
        if (this.watchReq) {
            Logger.log(`Stopping watch on ${this.getWatchPath(this.kind)}`);

            if (this.connectionCheckInterval) {
                clearInterval(this.connectionCheckInterval);
                this.connectionCheckInterval = null;
            }

            // We need to avoid an infinite loop between the watch's done callback and stopWatch().
            const watchReq = this.watchReq;
            this.watchReq = null;
            try {
                watchReq.abort();
            } catch(err) {
                Logger.log(err);
            }
        }

        this._kind = null;
        this._handler = null;
    }

    private onK8sWatchCallbackEvent(type: WatchEventType, k8sObj: KubernetesObject): void {
        this.lastEventReceivedTimestamp = Date.now();
        switch (type) {
            case 'ADDED':
                this.transformToPolarisObjectAndForward(k8sObj, polarisObj => this._handler.onObjectAdded(polarisObj));
                break;
            case 'MODIFIED':
                this.transformToPolarisObjectAndForward(k8sObj, polarisObj => this._handler.onObjectModified(polarisObj));
                break;
            case 'DELETED':
                this.transformToPolarisObjectAndForward(k8sObj, polarisObj => this._handler.onObjectDeleted(polarisObj));
                break;
            default:
                break;
        }

    }

    private getWatchPath(kind: ObjectKind): string {
        const pathStart = kind.group ? `/apis/${kind.group}` : '/api';
        const path = `${pathStart}/${kind.version}/${this.getKindPlural(kind.kind)}`;
        return path.toLowerCase();
    }

    private getKindPlural(kind: string): string {
        if (kind.endsWith('y')) {
            return kind.substring(0, kind.length - 1) + 'ies';
        }
        return kind + 's';
    }

    private checkIfRequiredPropsArePresent(kind: ObjectKind): void {
        const missingProps = REQUIRED_OBJECT_KIND_PROPERTIES.filter(prop => !kind[prop]);
        if (missingProps.length > 0) {
            throw new ObjectKindPropertiesMissingError(this, kind, missingProps);
        }
    }

    /**
     * Transforms the specified Kubernetes object to a Polaris object and passes it to `fn` on success.
     */
    private transformToPolarisObjectAndForward(k8sObj: KubernetesObject, fn: (polarisObj: ApiObject<any>) => void): void {
        try {
            const polarisObj = this.transformer.transformToPolarisObject(this._kind, k8sObj);
            if (polarisObj) {
                fn(polarisObj);
            }
        } catch (err) {
            Logger.log(err);
        }
    }

    /**
     * Periodically checks if a new event has been received from the watch and signals an error,
     * if no event has been received for some time.
     *
     * Until the @kubernetes/client-node implements HTTP/2 and pinging of the server, we use
     * this as a heuristic to detect if the connection has been interrupted.
     *
     * @see https://github.com/kubernetes-client/javascript/issues/596#issuecomment-792067322
     */
    private setupConnectionWatchHeuristic(): void {
        const connectionCheckTimeoutMs = getEnvironmentVariable(CONNECTION_CHECK_TIMEOUT_ENV_VAR, convertToNumber)
        if (typeof connectionCheckTimeoutMs !== 'number' || connectionCheckTimeoutMs <= 0) {
            // eslint-disable-next-line max-len
            Logger.log(`If you would like to enable a periodic connection check on the watch, please set the environment variable ${CONNECTION_CHECK_TIMEOUT_ENV_VAR} to the length of the periodic interval in milliseconds.`);
            return;
        }

        Logger.log(`Setting up connection check with interval of ${connectionCheckTimeoutMs / 1000 / 60} minutes.`);
        this.lastEventReceivedTimestamp = Date.now();
        this.connectionCheckInterval = setInterval(
            () => {
                const now = Date.now();
                const diff = now - this.lastEventReceivedTimestamp;
                if (diff >= connectionCheckTimeoutMs) {
                    if (this.isActive) {
                        this.handler.onError(new WatchTerminatedError(this, `No events received from the server for ${diff / 1000 / 60} minutes.`));
                        clearInterval(this.connectionCheckInterval);
                        this.connectionCheckInterval = null;
                    }
                }
            },
            connectionCheckTimeoutMs,
        );
    }

}
