
/**
 * A SlocTransformer is used to convert between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects that be serialized directly.
 *
 * @param S The orchestrator-independent SLOC type that is handled by this `SlocTransformer`.
 * @param O (optional) The orchestrtor-specific type that the SLOC object type is converted to/from by this `SlocTransformer`.
 */
export interface SlocTransformer<S, O = any> {

    /**
     * The unique ID of the SLOC type that is handled by this SlocTransformer.
     *
     * This corresponds to the `SlocTransformableMetadata.slocTypeId` that was supplied to the `@SlocTransformable` decorator.
     */
    readonly handledSlocTypeId: string;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @retuns A new SLOC object that results from transforming `orchPlainObj`.
     */
    transformToSlocObject(orchPlainObj: O): S;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: S): O;

}
