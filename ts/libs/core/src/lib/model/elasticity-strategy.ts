import { PolarisType } from '../transformation';
import { IndexByKey, initSelf } from '../util';
import { ApiObject } from './api-object';
import { SloTarget } from './slo-target';
import { StabilizationWindow } from './stabilization-window';

/**
 * A generic class that is used to set up specs for an elasticity strategy.
 *
 * A concrete `ElasticityStrategy` may use `ElasticityStrategySpec<T>` directly as the type for
 * its spec, or a class derived from this one, if, e.g., the transformation needs to be customized.
 *
 * Parameters that are defined by the output of the SLO are stored in `sloOutputParams`.
 * The type of this property determines if an elasticity strategy is compatible with a certain SLO.
 *
 * `staticConfig` should be used for other configuration data, which is not changed by the SLO.
 *
 * @note All elasticity strategy specs, no matter if they are define in TypeScript or not, must adhere to this class' layout.
 *
 * @param O The type of output parameters from the SLO/input parameters of the elasticity strategy.
 * @param T (optional) The type of `SloTarget` that the elasticity strategy can operate on.
 * @param C (optional) The type of `staticConfig` that the elasticity strategy accepts.
 */
export class ElasticityStrategySpec<O, T extends SloTarget = SloTarget, C = IndexByKey<any>> {

    /** Specifies the target on which to execute the elasticity strategy. */
    @PolarisType(() => SloTarget)
    targetRef: T;

    /**
     * The output parameters from the last `ServiceLevelObjective.evaluate()` call.
     */
    sloOutputParams: O;

    /**
     * Configures the duration of the period after the last elasticity strategy execution,
     * during which the strategy will not be executed again (to avoid unnecessary scaling).
     */
    // eslint-disable-next-line @typescript-eslint/member-ordering
    @PolarisType(() => StabilizationWindow)
    stabilizationWindow?: StabilizationWindow;

    /**
     * Static configuration that was supplied using `SloMappingSpec.staticElasticityStrategyConfig`.
     */
    staticConfig?: C;

    constructor(initData?: Partial<ElasticityStrategySpec<O>>) {
        initSelf(this, initData);
    }

}

/**
 * Used to submit/retrieve an elasticity strategy to/from the orchestrator.
 *
 * For elasticity strategies defined in TypeScript or elasticity strategies that require custom transformation,
 * a subclass of `ElasticityStrategy` should be created.
 *
 * However, this class is not defined as abstract to allow using elasticity strategies, which are not
 * defined in TypeScript, without creating a subclass - an `ElasticityStrategyKind` subclass is recommended though
 * to avoid forcing users to manually configure the kind data.
 *
 * @param O The type of output parameters from the SLO/input parameters of the elasticity strategy.
 * @param T (optional) The type of `SloTarget` that the elasticity strategy can operate on.
 * @param C (optional) The type of `staticConfig` that the elasticity strategy accepts.
 */
export class ElasticityStrategy<O, T extends SloTarget = SloTarget, C = IndexByKey<any>> extends ApiObject<ElasticityStrategySpec<O, T, C>> {

    @PolarisType(() => ElasticityStrategySpec)
    spec: ElasticityStrategySpec<O, T, C>;

    constructor(initData?: Partial<ElasticityStrategy<O, T, C>>) {
        super(initData);
    }

}
