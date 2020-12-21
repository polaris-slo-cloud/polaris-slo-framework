import { TypeFn } from '../util';
import { ObjectKind } from './object-kind';
import { SloTarget } from './slo-target';

/**
 * Identifies an elastcitity strategy kind/type.
 *
 * @param O The type of input data for the elasticity strategy (`ElasticityStrategySpec.sloOutputParams`). This must
 * match the type of output data of the SLO.
 * @param T (optional) The type of `SloTarget` that the elasticity strategy can operate on.
 */
export class ElasticityStrategyKind<O, T extends SloTarget = SloTarget> extends ObjectKind {

    /**
     * This property is needed to trigger type checking for the `O` parameter
     * when assigning an `ElasticityStrategyKind` to an `SloMappingSpec`.
     */
    private _sloOutputType: TypeFn<O>;

    /**
     * This property is needed to trigger type checking for the `T` parameter
     * when assigning an `ElasticityStrategyKind` to an `SloMappingSpec`.
     */
    private _sloTargetType: TypeFn<T>;

    constructor(initData?: Partial<ElasticityStrategyKind<O>>) {
        super(initData);
    }

}
