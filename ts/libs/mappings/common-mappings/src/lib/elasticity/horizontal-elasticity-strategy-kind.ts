import { ElasticityStrategyKind, SloCompliance } from '@polaris-sloc/core';
import { ReplicableTarget } from '../slo-targets';

export class HorizontalElasticityStrategyKind extends ElasticityStrategyKind<SloCompliance, ReplicableTarget> {

    constructor() {
        super({
            group: 'elasticity.polaris-slo-cloud.github.io',
            version: 'v1',
            kind: 'HorizontalElasticityStrategy',
        });
    }

}
