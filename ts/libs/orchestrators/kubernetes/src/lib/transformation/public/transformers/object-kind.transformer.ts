/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    Constructor,
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
 *      apiVersion: `${slocObj.group}/${slocObj.version}`,
 *      kind: slocObj.kind
 * }
 * ```
 */
export class ObjectKindTransformer implements ReusablePolarisTransformer<ObjectKind, ApiVersionKind> {

    transformToPolarisObject(slocType: Constructor<ObjectKind>, orchPlainObj: ApiVersionKind, transformationService: PolarisTransformationService): ObjectKind {
        const data = this.extractPolarisObjectInitData(slocType, orchPlainObj, transformationService);
        // Using `new slocType()` allows this transformer to work also for subclasses.
        return new slocType(data);
    }

    transformToOrchestratorPlainObject(slocObj: ObjectKind, transformationService: PolarisTransformationService): ApiVersionKind {
        const ret: ApiVersionKind = {
            kind: slocObj.kind,
        };
        if (slocObj.group) {
            ret.apiVersion = slocObj.group;
            if (slocObj.version) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                ret.apiVersion += `/${slocObj.version}`;
            }
        }
        return ret;
    }

    extractPolarisObjectInitData(
        slocType: Constructor<ObjectKind>,
        orchPlainObj: ApiVersionKind,
        transformationService: PolarisTransformationService,
    ): Partial<ObjectKind> {
        const data: Partial<ObjectKind> = {
            kind: orchPlainObj.kind,
        };
        if (orchPlainObj.apiVersion) {
            const segments = orchPlainObj.apiVersion.split('/');
            if (segments.length > 2) {
                throw new OrchestratorToPolarisTransformationError(slocType, orchPlainObj, '"apiVersion" must not contain more than one slash.');
            }
            data.group = segments[0];
            if (segments.length === 2) {
                data.version = segments[1];
            }
        }
        return data;
    }

}
