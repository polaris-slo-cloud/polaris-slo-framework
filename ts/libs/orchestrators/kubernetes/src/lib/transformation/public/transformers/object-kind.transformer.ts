import { Constructor, ObjectKind, OrchestratorToSlocTransformationError, ReusableSlocTransformer, SlocTransformationService } from '@polaris-sloc/core';
import { ApiVersionKind } from '../../../model';

/**
 * Transforms an `ObjectKind` between the SLOC format and a Kubernetes object of the form:
 * ```
 * {
 *      apiVersion: `${slocObj.group}/${slocObj.version}`,
 *      kind: slocObj.kind
 * }
 * ```
 */
export class ObjectKindTransformer implements ReusableSlocTransformer<ObjectKind, ApiVersionKind> {

    transformToSlocObject(slocType: Constructor<ObjectKind>, orchPlainObj: ApiVersionKind, transformationService: SlocTransformationService): ObjectKind {
        const data = this.extractSlocObjectInitData(slocType, orchPlainObj, transformationService);
        // Using `new slocType()` allows this transformer to work also for subclasses.
        return new slocType(data);
    }

    transformToOrchestratorPlainObject(slocObj: ObjectKind, transformationService: SlocTransformationService): ApiVersionKind {
        const ret: ApiVersionKind = {
            kind: slocObj.kind,
        };
        if (slocObj.group) {
            ret.apiVersion = slocObj.group;
            if (slocObj.version) {
                ret.apiVersion += `/${slocObj.version}`;
            }
        }
        return ret;
    }

    extractSlocObjectInitData(
        slocType: Constructor<ObjectKind>,
        orchPlainObj: ApiVersionKind,
        transformationService: SlocTransformationService,
    ): Partial<ObjectKind> {
        const data: Partial<ObjectKind> = {
            kind: orchPlainObj.kind,
        };
        if (orchPlainObj.apiVersion) {
            const segments = orchPlainObj.apiVersion.split('/');
            if (segments.length > 2) {
                throw new OrchestratorToSlocTransformationError(slocType, orchPlainObj, '"apiVersion" must not contain more than one slash.');
            }
            data.group = segments[0];
            if (segments.length === 2) {
                data.version = segments[1];
            }
        }
        return data;
    }

}
