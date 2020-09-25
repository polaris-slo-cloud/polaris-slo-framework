import { SlocTransformer } from '../public';

/**
 * Metadata that is used for transforming between SLOC objects and orchestrator-specific plain objects.
 */
export interface SlocTransformationMetadata<T> {

    /**
     * The `SlocTransformer` that should be used for converting this type
     * between SLOC objects and orchestrator-specific plain objects.
     */
    transformer: SlocTransformer<T, any>;

}
