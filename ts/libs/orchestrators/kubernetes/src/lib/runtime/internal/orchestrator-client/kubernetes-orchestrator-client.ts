import { KubeConfig, KubernetesObjectApi } from '@kubernetes/client-node';
import { ApiObject, OrchestratorClient, PolarisConstructor, PolarisRuntime, PolarisTransformationService } from '@polaris-sloc/core';
import { convertKubernetesErrorToPolaris } from './error-converter';

/**
 * `OrchestratorClient` implementation for Kubernetes.
 */
export class KubernetesOrchestratorClient implements OrchestratorClient {

    /** The native Kubernetes client. */
    protected k8sClient: KubernetesObjectApi;

    /** The service used to convert between Polaris objects and Kubernetes objects. */
    protected transformer: PolarisTransformationService;

    constructor(
        polarisRuntime: PolarisRuntime,
        k8sConfig: KubeConfig,
    ) {
        this.transformer = polarisRuntime.transformer;
        this.k8sClient = KubernetesObjectApi.makeApiClient(k8sConfig);
    }

    create<T extends ApiObject<any>>(newObj: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(newObj);
            const polarisType = this.getPolarisType(newObj);
            const response = await this.k8sClient.create(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    read<T extends ApiObject<any>>(query: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(query);
            const polarisType = this.getPolarisType(query);
            const response = await this.k8sClient.read(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    update<T extends ApiObject<any>>(obj: T): Promise<T> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(obj);
            const polarisType = this.getPolarisType(obj);
            const response = await this.k8sClient.replace(k8sObj);
            return this.transformer.transformToPolarisObject(polarisType, response.body);
        });
    }

    delete<T extends ApiObject<any>>(query: T): Promise<void> {
        return this.execRequestSafely(async () => {
            const k8sObj = this.transformer.transformToOrchestratorPlainObject(query);
            await this.k8sClient.delete(k8sObj);
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

}
