import { Constructor, ObjectKind, OrchestratorToSlocTransformationError, SlocTransformationService, SlocTransformer } from '@sloc/core';
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
export class ObjectKindTransformer implements SlocTransformer<ObjectKind, ApiVersionKind> {

    transformToSlocObject(slocType: Constructor<ObjectKind>, orchPlainObj: ApiVersionKind, transformationService: SlocTransformationService): ObjectKind {
        const data = this.extractDataFromOrchestratorPlainObject(slocType, orchPlainObj);
        return new ObjectKind(data);
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

    /**
     * Extracts the initialization data for an `ObjectKind` from an `ApiVersionKind` object.
     *
     * This method is meant to be reused by transformers of subclasses of `ObjectKind`.
     */
    extractDataFromOrchestratorPlainObject(slocType: Constructor<ObjectKind>, orchPlainObj: ApiVersionKind): Partial<ObjectKind> {
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
