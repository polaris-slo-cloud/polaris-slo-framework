import { TypeFn } from '../util';
import { ObjectKind } from './object-kind';

/**
 * Identifies an elastcitity strategy kind/type.
 *
 * @param T The type of input data for the elasticity strategy (`ElasticityStrategySpec.sloOutputParams`). This must
 * match the type of output data of the SLO.
 */
export class ElasticityStrategyKind<T> extends ObjectKind {

    /**
     * This property is needed to trigger type checking for the `T` parameter
     * when assigning an `ElasticityStrategyKind` to an `SloMappingSpec`.
     */
    private _sloOutputType: TypeFn<T>;

    constructor(initData?: Partial<ElasticityStrategyKind<T>>) {
        super(initData);
    }

}
