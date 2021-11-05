/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Constructor,
    JsonSchema,
    ObjectKind,
    OrchestratorToPolarisTransformationError,
    PolarisTransformationService,
    ReusablePolarisTransformer,
} from '@polaris-sloc/core';
import { ApiVersionKind } from '../../../model';

/**
 * Transforms an `ObjectKind` between the Polaris format and a Kubernetes object of the form:
 * ```
 * {
 *      apiVersion: `${polarisObj.group}/${polarisObj.version}`,
 *      kind: polarisObj.kind
 * }
 * ```
 *
 * **PolarisTransformer info:**
 * - **Inheritable**: Yes
 * - **Reusable in other transformers**: Yes
 * - **Handled orchestrator object properties**:
 *      - `apiVersion`
 *      - `kind`
 * - **Unknown property handling**: Copies unknown properties, because for Kubernetes the properties of most subclasses do not require transformation.
 */
export class ObjectKindTransformer implements ReusablePolarisTransformer<ObjectKind, ApiVersionKind> {

    transformToPolarisObject(
        polarisType: Constructor<ObjectKind>,
        orchPlainObj: ApiVersionKind,
        transformationService: PolarisTransformationService,
    ): ObjectKind {
        const data = this.extractPolarisObjectInitData(polarisType, orchPlainObj, transformationService);
        // Using `new polarisType()` allows this transformer to work also for subclasses.
        return new polarisType(data);
    }

    transformToOrchestratorPlainObject(polarisObj: ObjectKind, transformationService: PolarisTransformationService): ApiVersionKind {
        // Copy everything other than apiVersion to allow easy reuse for subclasses of ObjectKind.
        const { group, version, ...other } = polarisObj;
        const ret: ApiVersionKind = other;

        if (group) {
            ret.apiVersion = group;
            if (version) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                ret.apiVersion += `/${version}`;
            }
        }
        return ret;
    }

    extractPolarisObjectInitData(
        polarisType: Constructor<ObjectKind>,
        orchPlainObj: ApiVersionKind,
        transformationService: PolarisTransformationService,
    ): Partial<ObjectKind> {
        // Copy everything other than apiVersion to allow easy reuse for subclasses of ObjectKind.
        const { apiVersion, ...other } = orchPlainObj;
        const data: Partial<ObjectKind> = other;

        if (apiVersion) {
            const segments = apiVersion.split('/');
            if (segments.length > 2) {
                throw new OrchestratorToPolarisTransformationError(polarisType, orchPlainObj, '"apiVersion" must not contain more than one slash.');
            }
            data.group = segments[0];
            if (segments.length === 2) {
                data.version = segments[1];
            }
        }
        return data;
    }

    /**
     * @returns The JSON schema of Kubernetes `TypeMeta`, based on https://pkg.go.dev/k8s.io/apimachinery/pkg/apis/meta/v1#TypeMeta
     */
    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<ObjectKind>,
        polarisType: Constructor<ObjectKind>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<ApiVersionKind> {
        return {
            type: 'object',
            properties: {
                apiVersion: {
                    type: 'string',
                    description: 'APIVersion defines the versioned schema of this representation of an object. ' +
                        'Servers should convert recognized schemas to the latest internal value, and ' +
                        'may reject unrecognized values. ' +
                        'More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources',
                },
                kind: {
                    type: 'string',
                    description: 'Kind is a string value representing the REST resource this object represents. '+
                        'Servers may infer this from the endpoint the client submits requests to. ' +
                        'Cannot be updated. ' +
                        'In CamelCase. ' +
                        'More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds',
                },
            },
            required: [
                'apiVersion',
                'kind',
            ],
        };
    }

}
