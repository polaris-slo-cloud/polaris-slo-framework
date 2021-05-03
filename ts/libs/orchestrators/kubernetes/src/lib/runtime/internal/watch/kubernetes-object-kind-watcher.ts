import { KubeConfig, KubernetesObject, Watch } from '@kubernetes/client-node';
import {
    ApiObject,
    ObjectKind,
    ObjectKindPropertiesMissingError,
    ObjectKindWatcher,
    SlocTransformationService,
    WatchAlreadyStartedError,
    WatchEventsHandler,
} from '@polaris-sloc/core';

const REQUIRED_OBJECT_KIND_PROPERTIES: (keyof ObjectKind)[] = [ 'version', 'kind' ];

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
        private transformer: SlocTransformationService,
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
                // It is called if the watch terminates normally.
                if (err) {
                    console.log(err);
                }
                this.watchReq = null;
                this.stopWatch();
            },
        );

        console.log(`Started watch on ${path}`);
        this.watchReq = watchReq;
    }

    stopWatch(): void {
        if (this.watchReq) {
            console.log(`Stopping watch on ${this.getWatchPath(this.kind)}`);

            // We need to avoid an infinite loop between the watch's done callback and stopWatch().
            const watchReq = this.watchReq;
            this.watchReq = null;
            try {
                watchReq.abort();
            } catch(err) {
                console.log(err);
            }
        }

        this._kind = null;
        this._handler = null;
    }

    private onK8sWatchCallbackEvent(type: WatchEventType, k8sObj: KubernetesObject): void {
        switch (type) {
            case 'ADDED':
                this.transformToSlocObjectAndForward(k8sObj, slocObj => this._handler.onObjectAdded(slocObj));
                break;
            case 'MODIFIED':
                this.transformToSlocObjectAndForward(k8sObj, slocObj => this._handler.onObjectModified(slocObj));
                break;
            case 'DELETED':
                this.transformToSlocObjectAndForward(k8sObj, slocObj => this._handler.onObjectDeleted(slocObj));
                break;
            default:
                break;
        }

    }

    private getWatchPath(kind: ObjectKind): string {
        const pathStart = kind.group ? `/apis/${kind.group}` : '/api';
        const path = `${pathStart}/${kind.version}/${kind.kind}s`;
        return path.toLowerCase();
    }

    private checkIfRequiredPropsArePresent(kind: ObjectKind): void {
        const missingProps = REQUIRED_OBJECT_KIND_PROPERTIES.filter(prop => !kind[prop]);
        if (missingProps.length > 0) {
            throw new ObjectKindPropertiesMissingError(this, kind, missingProps);
        }
    }

    /**
     * Transforms the specified Kubernetes object to a SLOC object and passes it to `fn` on success.
     */
    private transformToSlocObjectAndForward(k8sObj: KubernetesObject, fn: (slocObj: ApiObject<any>) => void): void {
        try {
            const slocObj = this.transformer.transformToSlocObject(this._kind, k8sObj);
            if (slocObj) {
                fn(slocObj);
            }
        } catch (err) {
            console.log(err);
        }
    }

}
