import { ElasticityStrategy, ElasticityStrategyKind, HorizontalElasticityStrategyConfig, SloCompliance, SloTarget, initSelf } from '@polaris-sloc/core';
import { ReplicableTarget } from '../slo-targets';

/**
 * Denotes an elasticity strategy kind that employs horizontal scaling.
 */
export class HorizontalElasticityStrategyKind extends ElasticityStrategyKind<SloCompliance, ReplicableTarget> {

    constructor() {
        super({
            group: 'elasticity.polaris-slo-cloud.github.io',
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
