import { KubeConfig, KubernetesObject, KubernetesObjectApi } from '@kubernetes/client-node';
import {
    ApiObject,
    ApiObjectMetadata,
    NamespacedObjectReference,
    ObjectKind,
    OrchestratorClient,
    PolarisConstructor,
    PolarisRuntime,
    PolarisTransformationService,
    Scale,
} from '@polaris-sloc/core';
import { KubernetesScaleApi } from '../kubernetes-scale-api/kubernetes-scale-api';
import { convertKubernetesErrorToPolaris } from './error-converter';

/**
 * `OrchestratorClient` implementation for Kubernetes.
 */
export class KubernetesOrchestratorClient implements OrchestratorClient {

    /** The native Kubernetes client. */
    protected k8sClient: KubernetesObjectApi;

    /** The native Kubernetes client for reading the scale subresource. */
    protected k8sScaleClient: KubernetesScaleApi;

    /** The service used to convert between Polaris objects and Kubernetes objects. */
    protected transformer: PolarisTransformationService;

    constructor(
        polarisRuntime: PolarisRuntime,
        k8sConfig: KubeConfig,
    ) {
        this.transformer = polarisRuntime.transformer;
        this.k8sClient = KubernetesObjectApi.makeApiClient(k8sConfig);
        this.k8sScaleClient = KubernetesScaleApi.makeScaleApiClient(k8sConfig);
    }

    create<T extends ApiObject<any>>(newObj: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(newObj) as KubernetesObject;
            const polarisType = this.getPolarisType(newObj);
            const response = await this.k8sClient.create(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    read<T extends ApiObject<any>>(query: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(query) as KubernetesObject;
            const polarisType = this.getPolarisType(query);
            const response = await this.k8sClient.read(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    update<T extends ApiObject<any>>(obj: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(obj) as KubernetesObject;
            const polarisType = this.getPolarisType(obj);
            const response = await this.k8sClient.replace(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    delete<T extends ApiObject<any>>(query: T): Promise<void> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(query) as KubernetesObject;
            await this.k8sClient.delete(k8sObj);
        });
    }

    getScale(target: NamespacedObjectReference): Promise<Scale> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.objectRefToK8sObject(target);
            const response = await this.k8sScaleClient.readScale(k8sObj);
            return this.transformer.transformToPolarisObject(Scale, response.body);
        });
    }

    setScale(target: NamespacedObjectReference, newScale: Scale): Promise<Scale> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.objectRefToK8sObject(target);
            const k8sScale = this.transformer.transformToOrchestratorPlainObject(newScale) as KubernetesObject;
            const response = await this.k8sScaleClient.replaceScale(k8sObj, k8sScale);
            return this.transformer.transformToPolarisObject(Scale, response.body);
        });
    }

    /**
     * Safely executes the request function, by catching any error or promise rejection and
     * converting it to an `OrchestratorRequestError`.
     */
    protected async execRequestSafely<R>(reqFn: () => Promise<R>): Promise<R> {
        try {
            return await reqFn();
        } catch (err) {
            const polarisError = convertKubernetesErrorToPolaris(err);
            throw polarisError;
        }
    }

    private getPolarisType<T extends ApiObject<any>>(obj: T): PolarisConstructor<T> {
        // eslint-disable-next-line @typescript-eslint/ban-types
        return (obj as Object).constructor as any;
    }

    private objectRefToK8sObject(objRef: NamespacedObjectReference): KubernetesObject {
        const apiObj = new ApiObject<any>({
            objectKind: new ObjectKind({
                group: objRef.group,
                version: objRef.version,
                kind: objRef.kind,
            }),
            metadata: new ApiObjectMetadata({
                namespace: objRef.namespace,
                name: objRef.name,
            }),
        });

        return this.transformer.transformToOrchestratorPlainObject(apiObj);
    }

}
