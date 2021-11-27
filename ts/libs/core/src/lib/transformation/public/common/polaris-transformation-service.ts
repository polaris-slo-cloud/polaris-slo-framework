import { JsonSchema, ObjectKind } from '../../../model';
import { PolarisConstructor } from '../../../util';

/**
 * Implementations of this service should be used for converting between orchestrator-independent Polaris objects
 * and orchestrator-specific plain objects, which can be serialized.
 *
 * A `PolarisTransformationService` uses the `PolarisTransformers` that have been registered with it to transform complex objects.
 * If no transformer has been registered for a particular type, the `DefaultPolarisTransformer` will be used.
 *
 * Transformation from an orchestrator-specific plain object to a Polaris object can be done either by
 * - specifying the class of the Polaris object, or
 * - specifying the `ObjectKind` from the orchestrator-specific plain object (in this case, the `ObjectKind` must have been
 * registered with the `PolarisTransformationService` first).
 *
 * By default a transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
 * This is an intentional design decision, because model subclasses often add additional properties and they thus need
 * to be transformed differently than their parents.
 *
 * Typically a transformer for a subclass would also contain an instance of the transformer of the parent class, such
 * that the transformation of the parent's properties can be delegated.
 *
 * If the same transformer should be used for a parent- and a subclass, there are two possibilities:
 * - it can be registered for both of them or
 * - `PolarisTransformationConfig.inheritable` can be set to `true`, which will make all subclasses inherit the
 * transformer, unless they register their own.
 *
 * To register transformers and object kinds, please use the `PolarisTransformationServiceManager`, which can be obtained through the `PolarisRuntime`.
 */
export interface PolarisTransformationService {

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @param polarisType The Polaris type into which the plain object should be transformed.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @returns A new Polaris object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToPolarisObject<T>(polarisType: PolarisConstructor<T>, orchPlainObj: any): T;

    /**
     * Transforms the specified array of orchestrator-specific plain objects into an array of corresponding Polaris objects.
     *
     * @param polarisType The Polaris type into which the plain objects should be transformed.
     * @param orchPlainObjArray The array of orchestrator-specific plain objects to be transformed.
     * @returns A new array of Polaris objects that result from transforming `orchPlainObjArray` or `null` if `orchPlainObjArray` was `null` or `undefined`.
     */
    transformToPolarisObject<T>(polarisType: PolarisConstructor<T>, orchPlainObjArray: any[]): T[];

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the Polaris type of the object.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @returns A new Polaris object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToPolarisObject(kind: ObjectKind, orchPlainObj: any): any;

    /**
     * Transforms the specified array of orchestrator-specific plain objects into an array of corresponding Polaris objects.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the Polaris type of the objects.
     * @param orchPlainObjArray The array of orchestrator-specific plain objects to be transformed.
     * @returns A new array of Polaris objects that result from transforming `orchPlainObjArray` or `null` if `orchPlainObjArray` was `null` or `undefined`.
     */
    transformToPolarisObject(kind: ObjectKind, orchPlainObjArray: any[]): any[];

    /**
     * Transforms the specified Polaris object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param polarisObj The Polaris object to be transformed.
     * @returns A new orchestrator-specific plain object that may be serialized without any further changes or `null` if `polarisObj` was `null` or `undefined.
     */
    transformToOrchestratorPlainObject(polarisObj: any): any;

    /**
     * Transforms the specified array of Polaris objects into an array of orchestrator-specific plain objects
     * that may be serialized without any further changes.
     *
     * @param polarisArray The array of Polaris objects to be transformed.
     * @returns A new array of orchestrator-specific plain objects that may be serialized without any further changes
     * or `null` if `polarisArray` was `null` or `undefined.
     */
    transformToOrchestratorPlainObject(polarisArray: any[]): any[];

    /**
     * Transforms the orchestrator-independent schema of the Polaris type into an orchestrator-specific schema for creating `CustomResourceDefinitions`
     *
     * @param polarisSchema The Polaris schema of the type.
     * @param polarisType The Polaris type, whose schema should be transformed.
     * The type's schema is contained in `polarisSchema.definitions[polarisType.name]`.
     * @param transformationService The `PolarisTransformationService`.
     * @returns A new `JsonSchema` object that is specific to the used orchestrator or `null` if `polarisSchema` was `null` or `undefined`.
     */
    transformToOrchestratorSchema<T>(polarisSchema: JsonSchema<T>, polarisType: PolarisConstructor<T>): JsonSchema<any>;

    /**
     * Gets the type that has been defined for the property `propertyKey` of the class `polarisType` using
     * the `@PolarisType` decorator.
     *
     * @param polarisType The Polaris type that owns the property.
     * @param propertyKey The name of the property.
     * @returns The type that has been defined for the specified property or `undefined` if this information is not available.
     */
    getPropertyType<T>(polarisType: PolarisConstructor<T>, propertyKey: keyof T & string): PolarisConstructor<any>;

    /**
     * Gets the Polaris type that has been registered for the specified `ObjectKind`.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the Polaris type.
     * @returns The type that has been defined for the specified `ObjectKind` or `undefined` if this information is not available.
     */
    getPolarisType(kind: ObjectKind): PolarisConstructor<any>;

}
