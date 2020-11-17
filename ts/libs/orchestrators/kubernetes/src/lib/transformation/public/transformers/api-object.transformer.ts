import { V1ObjectMeta } from '@kubernetes/client-node';
import {
    ApiObject,
    ApiObjectMetadata,
    Constructor,
    InterfaceOf,
    ObjectKind,
    ReusableSlocTransformer,
    SlocTransformationService,
} from '@sloc/core';
import { ApiVersionKind, KubernetesObjectWithSpec } from '../../../model';

export class ApiObjectTransformer<T, P = any> implements ReusableSlocTransformer<ApiObject<T>, KubernetesObjectWithSpec<P>> {

    extractSlocObjectInitData(
        slocType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: SlocTransformationService,
    ): Partial<ApiObject<T>> {
        const apiVersionKind: ApiVersionKind = {
            apiVersion: orchPlainObj.apiVersion,
            kind: orchPlainObj.kind,
        };

        const specType = transformationService.getPropertyType(slocType, 'spec') ?? Object;

        const initData: Partial<ApiObject<T>> = {
            objectKind: transformationService.transformToSlocObject(ObjectKind, apiVersionKind),
            metadata: transformationService.transformToSlocObject(ApiObjectMetadata, orchPlainObj.metadata),
            spec: transformationService.transformToSlocObject(specType, orchPlainObj.spec),
        };

        return initData;
    }

    transformToSlocObject(
        slocType: Constructor<ApiObject<T>>,
        orchPlainObj: KubernetesObjectWithSpec<P>,
        transformationService: SlocTransformationService,
    ): ApiObject<T> {
        const initData = this.extractSlocObjectInitData(slocType, orchPlainObj, transformationService);
        return new slocType(initData);
    }

    transformToOrchestratorPlainObject(slocObj: ApiObject<T>, transformationService: SlocTransformationService): KubernetesObjectWithSpec<P> {
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
