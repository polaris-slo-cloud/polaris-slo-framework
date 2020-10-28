import { TransformationType } from 'class-transformer';
import { getSlocRuntimeOrThrow } from '../../runtime/public/sloc-runtime';
import { Constructor } from '../../util';

/**
 * This provides a wrapper around the transformation logic required by `class-transformer` and integrates it with the `SlocTransformationService`.
 */
export class PropertyTransformer<T> {

    constructor(private slocType: Constructor<T>) {}

    /**
     * Transform method called by `class-transformer`
     *
     * @param value The property value before the transformation.
     * @param obj The transformation source object.
     * @param transformationType The transformation type.
     * @returns The transformed object.
     *
     * @see https://github.com/typestack/class-transformer#additional-data-transformation
     */
    transform(value: any, obj: any, transformationType: TransformationType): any {
        const runtime = getSlocRuntimeOrThrow();
        switch (transformationType) {
            case TransformationType.CLASS_TO_PLAIN:
                return runtime.transformer.transformToOrchestratorPlainObject(value);
            case TransformationType.PLAIN_TO_CLASS:
                return runtime.transformer.transformToSlocObject(this.slocType, value);
            default:
                throw new Error(`Unexpected SlocRuntime: ${transformationType}`);
        }
    }
}
