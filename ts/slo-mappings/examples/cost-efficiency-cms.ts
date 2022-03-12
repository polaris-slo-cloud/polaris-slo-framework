import {
    CostEfficiencySloMapping,
    CostEfficiencySloMappingSpec,
    HorizontalElasticityStrategyKind,
    RestServiceTarget,
} from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata } from '@polaris-sloc/core';

export default new CostEfficiencySloMapping({
    metadata: new ApiObjectMetadata({
        namespace: 'default',
        name: 'resource-consumer',
    }),
    spec: new CostEfficiencySloMappingSpec({
        targetRef: new RestServiceTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'resource-consumer',
        }),
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        sloConfig: {
            responseTimeThresholdMs: 500,
            targetCostEfficiency: 10,
            minRequestsPercentile: 90,
        },
    }),
});
