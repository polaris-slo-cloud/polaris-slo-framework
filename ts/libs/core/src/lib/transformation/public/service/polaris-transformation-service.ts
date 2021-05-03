import { ObjectKind } from '../../../model';
import { PolarisConstructor } from '../../../util';
import { PolarisTransformationConfig, PolarisTransformer } from '../common';

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
 */
export interface PolarisTransformationService {

    /**
     * The default `PolarisTransformer` that is used if no specific transformer has been registered for a particular type.
     */
    readonly defaultTransformer: PolarisTransformer<any, any>;

    /**
     * Replaces the current default `PolarisTransformer` with the one provided.
     */
    changeDefaultTransformer(newDefaultTransformer: PolarisTransformer<any, any>): void;

    /**
     * Registers the specified transformer with this `PolarisTransformationService`.
     *
     * @note A transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
     * @param slocType The Polaris type for which to register the transformer.
     * @param transformer The `PolarisTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `PolarisTransformer`.
     */
    registerTransformer<T>(slocType: PolarisConstructor<T>, transformer: PolarisTransformer<T, any>, config?: PolarisTransformationConfig): void;

    /**
     * Associates the specified object kind with a Polaris type and optionally also with a transformer.
     *
     * This allows the `PolarisTransformationService` to automatically instantiate the appropriate class for a raw orchestrator object,
     * based on the kind information that it provides.
     *
     * @note A transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
     * @param kind The `ObjectKind` that should be registered.
     * @param slocType The Polaris type to be associated with the object kind.
     * @param transformer The `PolarisTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `PolarisTransformer`.
     */
    registerObjectKind<T>(
        kind: ObjectKind,
        slocType: PolarisConstructor<T>,
        transformer?: PolarisTransformer<T, any>,
        config?: PolarisTransformationConfig,
    ): void;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @param slocType The Polaris type into which the plain object should be transformed.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @returns A new Polaris object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToPolarisObject<T>(slocType: PolarisConstructor<T>, orchPlainObj: any): T;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding Polaris object.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the Polaris type of the object.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @returns A new Polaris object that results from transforming `orchPlainObj` or `null` if `orchPlainObj` was `null` or `undefined`.
     */
    transformToPolarisObject(kind: ObjectKind, orchPlainObj: any): any;

    /**
     * Transforms the specified Polaris object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The Polaris object to be transformed.
     * @returns A new orchestrator-specific plain object that may be serialized without any further changes or `null` if `slocObj` was `null` or `undefined.
     */
    transformToOrchestratorPlainObject(slocObj: any): any;

    /**
     * Gets the type that has been defined for the property `propertyKey` of the class `slocType` using
     * the `@PolarisType` decorator.
     *
     * @param slocType The Polaris type that owns the property.
     * @param propertyKey The name of the property.
     * @returns The type that has been defined for the specified property or `undefined` if this information is not available.
     */
    getPropertyType<T>(slocType: PolarisConstructor<T>, propertyKey: keyof T & string): PolarisConstructor<any>;

    /**
     * Gets the Polaris type that has been registered for the specified `ObjectKind`.
     *
     * @param kind The registered `ObjectKind` that can be used to deduce the Polaris type.
     * @returns The type that has been defined for the specified `ObjectKind` or `undefined` if this information is not available.
     */
    getPolarisType(kind: ObjectKind): PolarisConstructor<any>;

}
