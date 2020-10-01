import { SlocRuntime } from '../runtime/public/sloc-runtime';
import { ServiceLevelObjective } from '../slo';
import { SlocType } from '../transformation';
import { IndexByKey, initSelf } from '../util';
import { ElasticityStrategyKind } from './elasticity-strategy-kind';
import { SloTarget } from './slo-target';

/**
 * Defines the minimum configuration data that is needed for an SLO mapping.
 *
 * @param T The type that describes the SLO's required configuration.
 */
export interface SloMappingSpec<T> {

    /** Specifies the target on which to execute the elasticity strategy. */
    targetRef: SloTarget;

    /** Specifies the type of ElasticityStrategy to use for this SLO mapping. */
    elasticityStrategy: ElasticityStrategyKind;

    /**
     * Configuration parameters for the SLO.
     *
     * @note If `T` is a class, the `@SlocType` decorator needs to be applied in the
     * concrete class that implements `SloMappingSpec`.
     */
    sloConfig: T;

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

    /**
     * Creates a new instance of the `ServiceLevelObjective` class associated with this spec.
     *
     * The `ServiceLevelObjective.configure()` method is NOT called by this factory method.
     *
     * @param slocRuntime The `SlocRuntime` instance.
     * @returns A `ServiceLevelObjective` instance of the type of SLO associated with this spec.
     */
    createSloInstance(slocRuntime: SlocRuntime): ServiceLevelObjective<this, any>;

}

/**
 * Common superclass for SloMappingSpecs.
 */
export abstract class SloMappingSpecBase<T = IndexByKey<any>> implements SloMappingSpec<T> {

    @SlocType(() => SloTarget)
    targetRef: SloTarget;

    @SlocType(() => ElasticityStrategyKind)
    elasticityStrategy: ElasticityStrategyKind;

    sloConfig: T;

    staticElasticityStrategyConfig?: IndexByKey<any>;

    constructor(initData?: Partial<SloMappingSpecBase>) {
        initSelf(this, initData);
    }

    abstract createSloInstance(slocRuntime: SlocRuntime): ServiceLevelObjective<this, any>;

}
