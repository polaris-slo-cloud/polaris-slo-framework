import { ElasticityStrategy, ElasticityStrategyKind, SloCompliance, SloTarget, initSelf } from '@polaris-sloc/core';
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
 * Optional static configuration for a `HorizontalElasticityStrategy`.
 */
export interface HorizontalElasticityStrategyConfig {

    /**
     * The minium number of replicas that the target workload must have.
     *
     * @default 1
     */
    minReplicas?: number;

    /**
     * The maximum number of replicas that the target workload may have.
     *
     * @default unlimited
     */
    maxReplicas?: number;


    /**
     * The number of seconds to wait after a scaling operation on a target workload, before
     * executing another scaling operation if the SLo continues to be violated.
     *
     * @default 60
     */
    stabilizationWindowSeconds?: number;

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
