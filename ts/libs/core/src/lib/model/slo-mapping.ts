import { SlocType } from '../transformation';
import { initSelf } from '../util';
import { ElasticityStrategyKind } from './elasticity-strategy-kind';
import { ObjectReference } from './object-reference';

/**
 * Common superclass for SloMappings.
 */
export abstract class SloMappingBase {

    /** Specifies the target on which to execute the elasticity strategy. */
    @SlocType(() => ObjectReference)
    targetRef: ObjectReference;

    /** Specifies the type of ElasticityStrategy to use for this SLO mapping. */
    @SlocType(() => ElasticityStrategyKind)
    elasticityStrategy: ElasticityStrategyKind;

    constructor(initData?: Partial<SloMappingBase>) {
        initSelf(this, initData);
    }

}
