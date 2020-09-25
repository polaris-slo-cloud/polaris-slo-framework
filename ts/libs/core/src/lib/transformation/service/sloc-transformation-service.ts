import { SlocTransformer } from '../sloc-transformer';

/**
 * Implementations of this service should be used for transforming between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects, which can be serialized.
 *
 * A `SlocTransformationService` uses the `SlocTransformers` that have been registered with it to transform complex objects.
 */
export interface SlocTransformationService {

    /**
     * Registers the specified transformer with this `SlocTransformationService`.
     */
    registerTransformer(transformer: SlocTransformer<any, any>): void;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param slocTypeId The unique ID of the SLOC type into which the orchestrator-specific plain object should be transformed.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @retuns A new SLOC object that results from transforming `orchPlainObj`.
     */
    transformToSlocObject(slocTypeId: string, orchPlainObj: any): any;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: any): any;

}
