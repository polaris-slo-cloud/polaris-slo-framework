import { Constructor } from '../../util';
import { SlocTransformationService } from './service';

/**
 * A SlocTransformer is used to convert between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects that be serialized directly.
 *
 * @note A generic `SlocTransformer` may handle multiple SLOC types.
 *
 * @param T The orchestrator-independent SLOC type that is handled by this `SlocTransformer`.
 * @param P (optional) The orchestrtor-specific plain object type that the SLOC object type is converted to/from by this `SlocTransformer`.
 */
export interface SlocTransformer<T, P = any> {

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param slocType The type of SLOC object that should be created.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `SlocTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new SLOC object that results from transforming `orchPlainObj`.
     */
    transformToSlocObject(slocType: Constructor<T>, orchPlainObj: P, transformationService: SlocTransformationService): T;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `SlocTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: T, transformationService: SlocTransformationService): P;

}
