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
        slocType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: PolarisTransformationService,
    ): Partial<ApiObject<T>> {
        const apiVersionKind: ApiVersionKind = {
            apiVersion: orchPlainObj.apiVersion,
            kind: orchPlainObj.kind,
        };

        const specType = transformationService.getPropertyType(slocType, 'spec') ?? Object;

        const initData: Partial<ApiObject<T>> = {
            objectKind: transformationService.transformToPolarisObject(ObjectKind, apiVersionKind),
            metadata: transformationService.transformToPolarisObject(ApiObjectMetadata, orchPlainObj.metadata),
            spec: transformationService.transformToPolarisObject(specType, orchPlainObj.spec),
        };

        return initData;
    }

    transformToPolarisObject(
        slocType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: PolarisTransformationService,
    ): ApiObject<T> {
        const initData = this.extractPolarisObjectInitData(slocType, orchPlainObj, transformationService);
        return new slocType(initData);
    }

    transformToOrchestratorPlainObject(slocObj: ApiObject<T>, transformationService: PolarisTransformationService): KubernetesObjectWithSpec<P> {
        const apiVersionKind: ApiVersionKind = transformationService.transformToOrchestratorPlainObject(slocObj.objectKind);
        const metadata: InterfaceOf<V1ObjectMeta> = transformationService.transformToOrchestratorPlainObject(slocObj.metadata);
        const spec = transformationService.transformToOrchestratorPlainObject(slocObj.spec);

        const plain: KubernetesObjectWithSpec<P> = {
            ...apiVersionKind,
            metadata,
            spec,
        };
        return plain;
    }

}
