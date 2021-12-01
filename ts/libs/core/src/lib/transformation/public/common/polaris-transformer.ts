import { Constructor, JsonSchema } from '../../../util';
import { PolarisTransformationService } from './polaris-transformation-service';

/**
 * A PolarisTransformer is used to convert between orchestrator-independent Polaris objects
 * and orchestrator-specific plain objects that be serialized directly.
 *
 * @note A generic `PolarisTransformer` may handle multiple Polaris types.
 *
 * It is recommended to document the following properties for each transformer:
 * - **Inheritable**: Is it designed to be inherited by subclasses of `T`?
 * - **Reusable in other transformers**: Can this transformer be wrapped and reused in another transformer (e.g., a subclass of `T`)?
 * - **Handled orchestrator object properties**: The properties of a plain orchestrator object that are handled by the transformer.
 * - **Unknown property handling**: How does the transformer handle unknown properties on orchestrator objects (orchestrator -> Polaris)
 *   or on subclasses of `T` (Polaris -> orchestrator)?
 *
 * @param T The orchestrator-independent Polaris type that is handled by this `PolarisTransformer`.
 * @param P (optional) The orchestrator-specific plain object type that the Polaris object type is converted to/from by this `PolarisTransformer`.
 */
export interface PolarisTransformer<T, P = any> {

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @note If this transformer should be inheritable, it is recommended to not instantiate a hardcoded Polaris type in this method,
     * but to use `new polarisType(...)` instead.
     *
     * @param polarisType The type of Polaris object that should be created.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @returns A new Polaris object that results from transforming `orchPlainObj`.
     */
    transformToPolarisObject(polarisType: Constructor<T>, orchPlainObj: P, transformationService: PolarisTransformationService): T;

    /**
     * Transforms the specified Polaris object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param polarisObj The Polaris object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @returns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(polarisObj: T, transformationService: PolarisTransformationService): P;

    /**
     * Transforms the orchestrator-independent schema of the Polaris type into an orchestrator-specific schema for creating `CustomResourceDefinitions`.
     *
     * @param polarisSchema The JSON schema (without references) of the Polaris type.
     * @param polarisType The Polaris type, whose schema should be transformed.
     * @param transformationService The `PolarisTransformationService`.
     * @returns A new `JsonSchema` object that is specific to the used orchestrator.
     */
    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<T>,
        polarisType: Constructor<T>,
        transformationService: PolarisTransformationService
    ): JsonSchema<P>;

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
 *
 * Every reusable `ReusablePolarisTransformer` should document whether how it handles unknown properties
 * of orchestrator objects (orchestrator -> Polaris) or subclasses of `T` (Polaris -> orchestrator).
 * It is recommended to choose one of the following two options, depending on how many additional transformations
 * the subclasses are expected to require:
 *
 * - Ignore unknown properties and require a specific transformer for the subclass to handle them. Recommended, if subclasses will
 *   contain many properties that need to be transformed.
 * - Copy unknown properties to the init data object (orchestrator -> Polaris) or the orchestrator object (Polaris -> orchestrator).
 *   Transformers of subclasses can then delete those properties that need to be modified. Recommended, if most of the
 *   subclasses' properties can be copied without transformation.
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
     * @param polarisType The type of Polaris object, for which the init data should be extracted.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed. This is guaranteed to be neither `null` nor `undefined`.
     * @param transformationService The `PolarisTransformationService` that issued this call. It can be used to delegate the
     * transformation of nested objects.
     * @returns The init data for a Polaris object of type `T` that results from transforming `orchPlainObj`.
     */
    extractPolarisObjectInitData(polarisType: Constructor<T>, orchPlainObj: P, transformationService: PolarisTransformationService): Partial<T>;

}
