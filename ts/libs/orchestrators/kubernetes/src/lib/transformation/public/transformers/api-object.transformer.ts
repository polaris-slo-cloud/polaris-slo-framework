import { V1ObjectMeta } from '@kubernetes/client-node';
import {
    ApiObject,
    ApiObjectMetadata,
    Constructor,
    InterfaceOf,
    JsonSchema,
    ObjectKind,
    PolarisTransformationService,
    ReusablePolarisTransformer,
    unwrapNestedArraySchema,
} from '@polaris-sloc/core';
import { ApiVersionKind, KubernetesObjectWithSpec } from '../../../model';
import { KubernetesDefaultTransformer } from './kubernetes-default.transformer';

const DEFAULT_INT_FORMAT = 'int64';
const K8S_ADDITIONAL_PROPERTIES_KEY = 'x-kubernetes-preserve-unknown-fields';

/**
 * Transforms plain orchestrator API objects to Polaris to instances of `ApiObject` or a subclass thereof,
 * based on their object kinds.
 *
 * **PolarisTransformer info:**
 * - **Inheritable**: Yes
 * - **Reusable in other transformers**: Yes
 * - **Handled orchestrator object properties**:
 *      - `apiVersion`
 *      - `kind`
 *      - `metadata`
 *      - `spec`
 * - **Unknown property handling**: Ignores unknown properties of the root `ApiObject`.
 */
export class ApiObjectTransformer<T, P = any> implements ReusablePolarisTransformer<ApiObject<T>, KubernetesObjectWithSpec<P>> {

    private defaultTransformer = new KubernetesDefaultTransformer<ApiObject<T>>();

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

    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<ApiObject<T>>,
        polarisType: Constructor<ApiObject<T>>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<KubernetesObjectWithSpec<P>> {
        const transformedSchema: JsonSchema<KubernetesObjectWithSpec<P>> =
            this.defaultTransformer.transformToOrchestratorSchema(polarisSchema, polarisType, transformationService) as any;

        // Move the `ApiObject.objectKind` property's contents to the root level.
        const transformedObjKindSchema: JsonSchema<ApiVersionKind> = (transformedSchema as JsonSchema<ApiObject<T>>).properties.objectKind as any;
        delete (transformedSchema as JsonSchema<ApiObject<T>>).properties.objectKind;
        transformedSchema.required = transformedSchema.required.filter(propKey => propKey !== 'objectKind');
        transformedSchema.properties.apiVersion = transformedObjKindSchema.properties.apiVersion;
        transformedSchema.properties.kind = transformedObjKindSchema.properties.kind;
        transformedSchema.required.push('apiVersion', 'kind');

        // Generate the same metadata schema as Kubebuilder.
        transformedSchema.properties.metadata = { type: 'object' };

        // Recursively fix issues that would arise with this schema in Kubernetes.
        this.applyKubernetesFixes(transformedSchema);

        return transformedSchema;
    }

    /**
     * Recursively fixes the following issues that would arise with our schemas in Kubernetes:
     *
     * - Converts all properties of `type: number` to `type: integer`.
     * - Removes the `additionalProperties` field if `properties` is set, because these two fields are mutually exclusive in Kubernetes.
     */
    private applyKubernetesFixes<U>(k8sSchema: JsonSchema<U>): void {
        k8sSchema = unwrapNestedArraySchema(k8sSchema);

        // Convert `type: number` to `type: integer`.
        if (k8sSchema.type === 'number') {
            k8sSchema.type = 'integer';
            k8sSchema.format = DEFAULT_INT_FORMAT;
        }

        if (k8sSchema.additionalProperties === true) {
            // `additionalProperties: true` does not allow nesting additional properties in Kubernetes.
            // So if `additionalProperties` is set to `true` (instead of a specific type),
            // we need to replace `additionalProperties` with a Kubernetes-specific schema extension.
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            (k8sSchema as any)[K8S_ADDITIONAL_PROPERTIES_KEY] = true;
            delete k8sSchema.additionalProperties;
        }

        if (k8sSchema.properties) {
            // `additionalProperties` and `properties` are mutually exclusive in Kubernetes.
            // This does not apply to the K8S_ADDITIONAL_PROPERTIES_KEY schema extension above.
            delete k8sSchema.additionalProperties;

            // Recursion
            const propKeys = Object.keys(k8sSchema.properties) as (keyof U)[];
            propKeys.forEach(propKey => {
                const nestedSchema = k8sSchema.properties[propKey];
                this.applyKubernetesFixes(nestedSchema);
            });
        }
    }

}
