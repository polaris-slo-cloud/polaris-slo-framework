import { ObjectKind } from './object-kind';

/**
 * Identifies an elastcitity strategy kind/type.
 *
 * @param T The type of input data for the elasticity strategy (`ElasticityStrategySpec.sloOutputParams`). This must
 * match the type of output data of the SLO.
 */
export class ElasticityStrategyKind<T> extends ObjectKind {

    constructor(initData?: Partial<ElasticityStrategyKind<T>>) {
        super(initData);
    }

}
