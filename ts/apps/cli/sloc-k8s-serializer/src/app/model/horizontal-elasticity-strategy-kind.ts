import { ElasticityStrategyKind, SloCompliance } from '@sloc/core';

export class HorizontalElasticityStrategyKind extends ElasticityStrategyKind<SloCompliance> {

    constructor() {
        super({
            group: 'elasticity.sloc.github.io',
            version: 'v1',
            kind: 'HorizontalElasticityStrategy',
        });
    }

}
