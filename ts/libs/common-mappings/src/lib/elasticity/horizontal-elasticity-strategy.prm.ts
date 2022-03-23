import {
    ElasticityStrategy,
    ElasticityStrategyKind,
    HorizontalElasticityStrategyConfig,
    POLARIS_API,
    SloCompliance,
    SloTarget,
    initSelf,
} from '@polaris-sloc/core';
import { ReplicableTarget } from '../slo-targets';

// Re-export HorizontalElasticityStrategyConfig for easier imports in the code generator.
export { HorizontalElasticityStrategyConfig } from '@polaris-sloc/core';

/**
 * Denotes an elasticity strategy kind that employs horizontal scaling.
 */
export class HorizontalElasticityStrategyKind extends ElasticityStrategyKind<SloCompliance, ReplicableTarget> {

    constructor() {
        super({
            group: POLARIS_API.ELASTICITY_GROUP,
            version: 'v1',
            kind: 'HorizontalElasticityStrategy',
        });
    }

}

/**
 * Denotes an elasticity strategy that employs horizontal scaling.
 */
export class HorizontalElasticityStrategy extends ElasticityStrategy<SloCompliance, SloTarget, HorizontalElasticityStrategyConfig> {

    constructor(initData?: Partial<HorizontalElasticityStrategy>) {
        super(initData);
        this.objectKind = new HorizontalElasticityStrategyKind();
        initSelf(this, initData);
    }

}
