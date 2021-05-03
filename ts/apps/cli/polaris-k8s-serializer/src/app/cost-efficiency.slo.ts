import {
    CostEfficiencySloMapping,
    CostEfficiencySloMappingSpec,
    HorizontalElasticityStrategyKind,
    RestServiceTarget,
} from '@polaris-sloc/common-mappings';
import { ApiObjectMetadata } from '@polaris-sloc/core';


export default new CostEfficiencySloMapping({
    metadata: new ApiObjectMetadata({
        namespace: 'mesh',
        name: 'gentics-mesh-cost-efficiency',
    }),
    spec: new CostEfficiencySloMappingSpec({
        targetRef: new RestServiceTarget({
            group: 'apps',
            version: 'v1',
            kind: 'StatefulSet',
            name: 'mesh-gentics-mesh',
        }),
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        sloConfig: {
            responseTimeThresholdMs: 500,
            targetCostEfficiency: 10,
            minRequestsPercentile: 90,
        },
    }),
});
