
/**
 * Configuration used to customize the registration of a `PolarisTransformer`.
 */
export interface PolarisTransformationConfig {

    /**
     * If `true`, the `PolarisTransformer` will be used for subclasses of the registered type,
     * unless they explicitly register their own transformer.
     *
     * Default: `false`
     */
    inheritable?: boolean;

}
