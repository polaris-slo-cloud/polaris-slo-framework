import { Constructor } from '../../../util';
import { SlocTransformationService } from './../service';

/**
 * A SlocTransformer is used to convert between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects that be serialized directly.
 *
 * @note A generic `SlocTransformer` may handle multiple SLOC types.
 *
 * @param T The orchestrator-independent SLOC type that is handled by this `SlocTransformer`.
 * @param P (optional) The orchestrtor-specific plain object type that the SLOC object type is converted to/from by this `SlocTransformer`.
 */
export interface SlocTransformer<T, P = any> {

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @note If this transformer should be inheritable, it is recommended to not instantiate a hardcoded SLOC type in this method,
     * but to use `new slocType(...)` instead.
     *
     * @param slocType The type of SLOC object that should be created.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `SlocTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new SLOC object that results from transforming `orchPlainObj`.
     */
    transformToSlocObject(slocType: Constructor<T>, orchPlainObj: P, transformationService: SlocTransformationService): T;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `SlocTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: T, transformationService: SlocTransformationService): P;

}

/**
 * Extension of `SlocTransformer`, which divides the transformation of an orchestrator-specific
 * plain object into two stages:
 * 1. Extraction of the data required by the constructor of the SLOC object.
 * 2. Instantiation of the SLOC object using the extracted data.
 *
 * This interface is useful if a SLOC type requiring transformation is expected to have subclasses.
 * The transformer for the subclass can use the `extractSlocObjectInitData()` method of the parent's
 * transformer to obtain the transformed data for the parent without instantiating an unneeded
 * instance of the parent class. The transformer of the subclass can then add its own data and
 * finally instantiate the subclass directly.
 */
export interface ReusableSlocTransformer<T, P = any> extends SlocTransformer<T, P> {

    /**
     * Transforms the specified orchestrator-specific plain object into the init data (plain data object)
     * required by the constructor of the corresponding SLOC object.
     *
     * This method can be used by a transformer of a subclass `U` of `T` to delegate the extraction of the data required
     * by `T` without instantiating `T`. The transformer of `U` can then add the data of its type before passing
     * all the init data to the constructor of `U`.
     *
     * @param slocType The type of SLOC object, for which the init data should be extracted.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `SlocTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @retuns The init data for a SLOC object of type `T` that results from transforming `orchPlainObj`.
     */
    extractSlocObjectInitData(slocType: Constructor<T>, orchPlainObj: P, transformationService: SlocTransformationService): Partial<T>;

}
