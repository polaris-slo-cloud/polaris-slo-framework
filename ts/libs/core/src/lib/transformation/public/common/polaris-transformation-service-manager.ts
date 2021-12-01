import { PolarisConstructor } from '../../../util';
import { ObjectKind } from './object-kind.prm';
import { PolarisTransformationConfig } from './polaris-transformation-config';
import { PolarisTransformationService } from './polaris-transformation-service';
import { PolarisTransformer } from './polaris-transformer';

/**
 * Extends the {@link PolarisTransformationService} to provide functionality for registering transformers
 * and `ObjectKinds`.
 */
export interface PolarisTransformationServiceManager extends PolarisTransformationService {

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
     * @param polarisType The Polaris type for which to register the transformer.
     * @param transformer The `PolarisTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `PolarisTransformer`.
     */
    registerTransformer<T, P>(polarisType: PolarisConstructor<T>, transformer: PolarisTransformer<T, P>, config?: PolarisTransformationConfig): void;

    /**
     * Associates the specified object kind with a Polaris type and optionally also with a transformer.
     *
     * This allows the `PolarisTransformationService` to automatically instantiate the appropriate class for a raw orchestrator object,
     * based on the kind information that it provides.
     *
     * @note A transformer registration for a class `A` applies only to direct instances of `A`, not to instances of any of its subclasses.
     * @param kind The `ObjectKind` that should be registered.
     * @param polarisType The Polaris type to be associated with the object kind.
     * @param transformer The `PolarisTransformer` for the type.
     * @param config (optional) Additional configuration for registration of the `PolarisTransformer`.
     */
    registerObjectKind<T>(
        kind: ObjectKind,
        polarisType: PolarisConstructor<T>,
        transformer?: PolarisTransformer<T, any>,
        config?: PolarisTransformationConfig,
    ): void;

}
