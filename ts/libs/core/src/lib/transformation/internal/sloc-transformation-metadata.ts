import { Constructor } from '../../util';
import { PolarisTransformationConfig, PolarisTransformer } from '../public';

/**
 * Metadata that is used for transforming between SLOC objects and orchestrator-specific plain objects.
 */
export interface PolarisTransformationMetadata<T> extends PolarisTransformationConfig {

    /**
     * The `PolarisTransformer` that should be used for converting this type
     * between SLOC objects and orchestrator-specific plain objects.
     */
    transformer: PolarisTransformer<T, any>;

    /**
     * The type for which this metadata has been registered.
     *
     * Since `Reflect.getMetadata()` goes up the prototype hierarchy, this property can
     * be used to figure out to which type this metadata has actually been applied.
     */
    typeRegistered: Constructor<T>;

}
