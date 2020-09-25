import { SlocTransformer } from '../sloc-transformer';

/**
 * Maintains a mapping between unique SLOC type IDs and their respective transformers for the currently used orchestrator.
 */
export interface SlocTransformerRegistry {

    /**
     * Registers the specified transformer with this `SlocTransformerRegistry`.
     *
     * @param slocTypeId The unique ID of the SLOC type, for which to register the transformer.
     * @param transformer The `SlocTransformer` for the type.
     */
    registerTransformer(slocTypeId: string, transformer: SlocTransformer<any, any>): void;

    /**
     * @returns The `SlocTransformer` registed for the type of `slocObj` or `undefined` if no transformer is registered for the type.
     * @throws A `NotSlocTransformableError` if `slocObj` is not `SlocTransformable`.
     */
    getTransformer<S>(slocObj: S): SlocTransformer<S, any>;

}
