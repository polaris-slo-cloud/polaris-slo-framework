import { PolarisType } from '../transformation';
import { IndexByKey, initSelf } from '../util';
import { ApiObject } from './api-object';
import { ElasticityStrategyKind } from './elasticity-strategy-kind';
import { SloTarget } from './slo-target';
import { StabilizationWindow } from './stabilization-window';

/**
 * Defines the minimum configuration data that is needed for an SLO mapping.
 *
 * @param C The type that describes the SLO's required configuration.
 * @param O The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 * @param T (optional) The type of `SloTarget` that the SLO can operate on.
 */
export interface SloMappingSpec<C, O, T extends SloTarget = SloTarget> {

    /** Specifies the target on which to execute the elasticity strategy. */
    targetRef: T;

    /** Specifies the type of ElasticityStrategy to use for this SLO mapping. */
    elasticityStrategy: ElasticityStrategyKind<O, T>;

    /**
     * Configures the duration of the period after the last elasticity strategy execution,
     * during which the strategy will not be executed again (to avoid unnecessary scaling).
     */
    stabilizationWindow?: StabilizationWindow;

    /**
     * Configuration parameters for the SLO.
     *
     * @note If `T` is a class, the `@PolarisType` decorator needs to be applied in the
     * concrete class that implements `SloMappingSpec`.
     */
    sloConfig: C;

    /**
     * Any static configuration parameters, which are unknown to the SLO, but which may be required to configure
     * the chosen kind of elasticity strategy should be specified here. They will be copied over
     * into the spec of the elasticity strategy.
     *
     * For example, suppose the SLO knows only about the parameters in `SloCompliance`, but you want
     * to use an elasticity strategy that requires an additional parameter, e.g., `maxReplicas`.
     * This can be configured when instantiating the SloMapping:
     *
     * ```
     * new MySloMapping({
     *      elasticityStrategy: new ElasticityStrategyKind({
     *          kind: 'my-special-elasticity-strategy-kind',
     *          ...
     *      }),
     *      ...,
     *      staticElasticityStrategyConfig: {
     *          // Anything in here will be copied over to the `staticConfig` property of the elasticity strategy spec.
     *          maxReplicas: 100,
     *      },
     * });
     * ```
     */
    staticElasticityStrategyConfig?: IndexByKey<any>;

}

/**
 * Common superclass for SloMappingSpecs.
 *
 * @important If the generic parameter `T` is specified (a subclass of `SloTarget`), make sure
 * that you override the `@PolarisType` decorator of `targetRef` with the correct type.
 *
 * @param C The type that describes the SLO's required configuration.
 * @param O The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 * @param T (optional) The type of `SloTarget` that the SLO can operate on.
 */
export abstract class SloMappingSpecBase<C, O, T extends SloTarget = SloTarget> implements SloMappingSpec<C, O, T> {

    @PolarisType(() => SloTarget)
    targetRef: T;

    @PolarisType(() => ElasticityStrategyKind)
    elasticityStrategy: ElasticityStrategyKind<O, T>;

    @PolarisType(() => StabilizationWindow)
    stabilizationWindow?: StabilizationWindow;

    sloConfig: C;

    staticElasticityStrategyConfig?: IndexByKey<any>;

    constructor(initData?: Partial<SloMappingSpecBase<C, O, T>>) {
        initSelf(this, initData);
    }

}

/**
 * Common superclass for SloMappings.
 *
 * @important The `spec` must be decorated with `@PolarisType` if `T` is a class.
 *
 * @param T The type of `SloMappingSpec`.
 */
export abstract class SloMappingBase<T extends SloMappingSpec<any, any, any>> extends ApiObject<T> {

    constructor(initData?: Partial<SloMappingBase<T>>) {
        super(initData);
        initSelf(this, initData);
    }

}

/**
 * Convenience type to refer to an `SloMappingBase<SloMappingSpec<C, O, T>>` with a shorter generics parameter sequence.
 *
 * Use this type to declare the type of properties and method parameters.
 * For creating an `SloMapping` subclass, please extend `SloMappingBase`.
 */
export type SloMapping<C, O, T extends SloTarget = SloTarget> = SloMappingBase<SloMappingSpec<C, O, T>>;

/**
 * Convenience type to define the type of initilization data for the constructor of an `SloMapping`.
 */
export type SloMappingInitData<T> = Partial<Omit<T, 'objectKind'>>;
