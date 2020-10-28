
/**
 * Configuration used to customize the registration of a `SlocTransformer`.
 */
export interface SlocTransformationConfig {

    /**
     * If `true`, the `SlocTransformer` will be used for subclasses of the registered type,
     * unless they explicitly register their own transformer.
     *
     * Default: `false`
     */
    inheritable?: boolean;

}
