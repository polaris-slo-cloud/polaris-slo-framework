import { SlocTransformer } from '../sloc-transformer';

export interface SlocTransformerRegistry {

    /**
     * Registers the specified transformer with this `SlocTransformerRegistry`.
     */
    registerTransformer(transformer: SlocTransformer<any, any>): void;

    /**
     * @returns The `SlocTransformer` registed for the type of `slocObj` or `undefined` if no transformer is registered for the type.
     * @throws A `NotSlocTransformableError` if `slocObj` is not `SlocTransformable`.
     */
    getTransformer<S>(slocObj: S): SlocTransformer<S, any>;

}
