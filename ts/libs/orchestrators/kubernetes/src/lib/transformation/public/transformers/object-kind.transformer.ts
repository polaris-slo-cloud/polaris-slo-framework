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
 * - **Unknown property handling**: Ignores unknown properties
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
        const ret: ApiVersionKind = {
            kind: polarisObj.kind,
        };
        if (polarisObj.group) {
            ret.apiVersion = polarisObj.group;
            if (polarisObj.version) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                ret.apiVersion += `/${polarisObj.version}`;
            }
        }
        return ret;
    }

    extractPolarisObjectInitData(
        polarisType: Constructor<ObjectKind>,
        orchPlainObj: ApiVersionKind,
        transformationService: PolarisTransformationService,
    ): Partial<ObjectKind> {
        const data: Partial<ObjectKind> = {
            kind: orchPlainObj.kind,
        };
        if (orchPlainObj.apiVersion) {
            const segments = orchPlainObj.apiVersion.split('/');
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

}
