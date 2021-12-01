import { TransformFnParams, TransformationType } from 'class-transformer';
import { Constructor } from '../../util';
import { PolarisTransformationService } from '../public/common/polaris-transformation-service';

/** Used by the {@link PropertyTransformer} to obtain the {@link PolarisTransformationService} without a circular dependency to `PolarisRuntime`. */
export type PolarisTransformationServiceGetter = () => PolarisTransformationService;

/**
 * This provides a wrapper around the transformation logic required by `class-transformer` and integrates it with the `PolarisTransformationService`.
 */
export class PropertyTransformer<T> {

    private static transformationServiceGetter: PolarisTransformationServiceGetter;

    constructor(private polarisType: Constructor<T>) {}

    /**
     * Configures the PropertyTransformer with the {@link PolarisTransformationServiceGetter}.
     *
     * This is called by the `PolarisRuntimeBase` constructor.
     */
    static initPropertyTransformer(transformationServiceGetter: PolarisTransformationServiceGetter): void {
        PropertyTransformer.transformationServiceGetter = transformationServiceGetter;
    }

    /**
     * Transform method called by `class-transformer`
     *
     * @param transformParams The transformation parameters provided by class-transformer.
     * This object has four properties:
     *  * `value` The property value before the transformation.
     *  * `key` The name of the property within the source object.
     *  * `obj` The transformation source object.
     *  * `type` The transformation type.
     *
     * @returns The transformed object.
     *
     * @see https://github.com/typestack/class-transformer#additional-data-transformation
     */
    transform(transformParams: TransformFnParams): any {
        const transformationService = PropertyTransformer.transformationServiceGetter();
        if (!transformationService) {
            throw new Error('PropertyTransformer cannot find the PolarisTransformationService. Did you make use of PolarisRuntimeBase?')
        }

        switch (transformParams.type) {
            case TransformationType.CLASS_TO_PLAIN:
                return transformationService.transformToOrchestratorPlainObject(transformParams.value);
            case TransformationType.PLAIN_TO_CLASS:
                return transformationService.transformToPolarisObject(this.polarisType, transformParams.value);
            default:
                throw new Error(`Unexpected transformation type: ${transformParams.type}`);
        }
    }
}
