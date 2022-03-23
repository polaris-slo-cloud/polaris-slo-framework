import {
    ElasticityStrategy,
    ElasticityStrategyKind,
    POLARIS_API,
    SloCompliance,
    SloTarget,
    VerticalElasticityStrategyConfig,
    initSelf,
} from '@polaris-sloc/core';
import { ReplicableTarget } from '../slo-targets';

// Re-export VerticalElasticityStrategyConfig for easier imports in the code generator.
export { VerticalElasticityStrategyConfig } from '@polaris-sloc/core';

/**
 * Denotes an elasticity strategy kind that employs vertical scaling.
 */
export class VerticalElasticityStrategyKind extends ElasticityStrategyKind<SloCompliance, ReplicableTarget> {

    constructor() {
        super({
            group: POLARIS_API.ELASTICITY_GROUP,
            version: 'v1',
            kind: 'VerticalElasticityStrategy',
        });
    }

}

/**
 * Denotes an elasticity strategy that employs vertical scaling.
 */
export class VerticalElasticityStrategy extends ElasticityStrategy<SloCompliance, SloTarget, VerticalElasticityStrategyConfig> {

    constructor(initData?: Partial<VerticalElasticityStrategy>) {
        super(initData);
        this.objectKind = new VerticalElasticityStrategyKind();
        initSelf(this, initData);
    }

}
