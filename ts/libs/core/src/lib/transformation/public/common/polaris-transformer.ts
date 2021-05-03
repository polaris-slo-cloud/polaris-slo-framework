import { Constructor } from '../../../util';
import { PolarisTransformationService } from './../service';

/**
 * A PolarisTransformer is used to convert between orchestrator-independent Polaris objects
 * and orchestrator-specific plain objects that be serialized directly.
 *
 * @note A generic `PolarisTransformer` may handle multiple Polaris types.
 *
 * @param T The orchestrator-independent Polaris type that is handled by this `PolarisTransformer`.
 * @param P (optional) The orchestrtor-specific plain object type that the Polaris object type is converted to/from by this `PolarisTransformer`.
 */
export interface PolarisTransformer<T, P = any> {

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @note If this transformer should be inheritable, it is recommended to not instantiate a hardcoded Polaris type in this method,
     * but to use `new slocType(...)` instead.
     *
     * @param slocType The type of Polaris object that should be created.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new Polaris object that results from transforming `orchPlainObj`.
     */
    transformToPolarisObject(slocType: Constructor<T>, orchPlainObj: P, transformationService: PolarisTransformationService): T;

    /**
     * Transforms the specified Polaris object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The Polaris object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: T, transformationService: PolarisTransformationService): P;

}

/**
 * Extension of `PolarisTransformer`, which divides the transformation of an orchestrator-specific
 * plain object into two stages:
 * 1. Extraction of the data required by the constructor of the Polaris object.
 * 2. Instantiation of the Polaris object using the extracted data.
 *
 * This interface is useful if a Polaris type requiring transformation is expected to have subclasses.
 * The transformer for the subclass can use the `extractPolarisObjectInitData()` method of the parent's
 * transformer to obtain the transformed data for the parent without instantiating an unneeded
 * instance of the parent class. The transformer of the subclass can then add its own data and
 * finally instantiate the subclass directly.
 */
export interface ReusablePolarisTransformer<T, P = any> extends PolarisTransformer<T, P> {

    /**
     * Transforms the specified orchestrator-specific plain object into the init data (plain data object)
     * required by the constructor of the corresponding Polaris object.
     *
     * This method can be used by a transformer of a subclass `U` of `T` to delegate the extraction of the data required
     * by `T` without instantiating `T`. The transformer of `U` can then add the data of its type before passing
     * all the init data to the constructor of `U`.
     *
     * @param slocType The type of Polaris object, for which the init data should be extracted.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns The init data for a Polaris object of type `T` that results from transforming `orchPlainObj`.
     */
    extractPolarisObjectInitData(slocType: Constructor<T>, orchPlainObj: P, transformationService: PolarisTransformationService): Partial<T>;

}
