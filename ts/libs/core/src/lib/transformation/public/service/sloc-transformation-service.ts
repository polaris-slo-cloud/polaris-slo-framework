import { Constructor } from '../../../util';
import { SlocTransformer } from '../sloc-transformer';

/**
 * Implementations of this service should be used for converting between orchestrator-independent SLOC objects
 * and orchestrator-specific plain objects, which can be serialized.
 *
 * A `SlocTransformationService` uses the `SlocTransformers` that have been registered with it to transform complex objects.
 *
 * If no transformer has been registered for a particular type, the `DefaultSlocTransformer` will be used.
 */
export interface SlocTransformationService {

    /**
     * The default `SlocTransformer` that is used if no specific transformer has been registered for a particular type.
     */
    readonly defaultTransformer: SlocTransformer<any, any>;

    /**
     * Replaces the current default `SlocTransformer` with the one provided.
     */
    changeDefaultTransformer(newDefaultTransformer: SlocTransformer<any, any>): void;

    /**
     * Registers the specified transformer with this `SlocTransformationService`.
     *
     * @param slocTypeId The SLOC type for which to register the transformer.
     * @param transformer The `SlocTransformer` for the type.
     */
    registerTransformer<T>(slocType: Constructor<T>, transformer: SlocTransformer<T, any>): void;

    /**
     * Transforms the specified orchestrator-specific plain object into a corresponding SLOC object.
     *
     * @param slocType The SLOC type into which the plain object should be transformed.
     * @param orchPlainObj The orchestrator-specific plain object to be transformed.
     * @retuns A new SLOC object that results from transforming `orchPlainObj`.
     */
    transformToSlocObject<T>(slocType: Constructor<T>, orchPlainObj: any): T;

    /**
     * Transforms the specified SLOC object into an orchestrator-specific plain object that may be serialized without any further changes.
     *
     * @param slocObj The SLOC object to be transformed.
     * @retuns A new orchestrator-specific plain object that may be serialized without any further changes.
     */
    transformToOrchestratorPlainObject(slocObj: any): any;

}
