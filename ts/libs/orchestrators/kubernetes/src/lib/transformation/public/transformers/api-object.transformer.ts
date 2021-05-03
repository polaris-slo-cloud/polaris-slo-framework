import { V1ObjectMeta } from '@kubernetes/client-node';
import {
    ApiObject,
    ApiObjectMetadata,
    Constructor,
    InterfaceOf,
    ObjectKind,
    PolarisTransformationService,
    ReusablePolarisTransformer,
} from '@polaris-sloc/core';
import { ApiVersionKind, KubernetesObjectWithSpec } from '../../../model';

export class ApiObjectTransformer<T, P = any> implements ReusablePolarisTransformer<ApiObject<T>, KubernetesObjectWithSpec<P>> {

    extractPolarisObjectInitData(
        polarisType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: PolarisTransformationService,
    ): Partial<ApiObject<T>> {
        const apiVersionKind: ApiVersionKind = {
            apiVersion: orchPlainObj.apiVersion,
            kind: orchPlainObj.kind,
        };

        const specType = transformationService.getPropertyType(polarisType, 'spec') ?? Object;

        const initData: Partial<ApiObject<T>> = {
            objectKind: transformationService.transformToPolarisObject(ObjectKind, apiVersionKind),
            metadata: transformationService.transformToPolarisObject(ApiObjectMetadata, orchPlainObj.metadata),
            spec: transformationService.transformToPolarisObject(specType, orchPlainObj.spec),
        };

        return initData;
    }

    transformToPolarisObject(
        polarisType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: PolarisTransformationService,
    ): ApiObject<T> {
        const initData = this.extractPolarisObjectInitData(polarisType, orchPlainObj, transformationService);
        return new polarisType(initData);
    }

    transformToOrchestratorPlainObject(polarisObj: ApiObject<T>, transformationService: PolarisTransformationService): KubernetesObjectWithSpec<P> {
        const apiVersionKind: ApiVersionKind = transformationService.transformToOrchestratorPlainObject(polarisObj.objectKind);
        const metadata: InterfaceOf<V1ObjectMeta> = transformationService.transformToOrchestratorPlainObject(polarisObj.metadata);
        const spec = transformationService.transformToOrchestratorPlainObject(polarisObj.spec);

        const plain: KubernetesObjectWithSpec<P> = {
            ...apiVersionKind,
            metadata,
            spec,
        };
        return plain;
    }

}
