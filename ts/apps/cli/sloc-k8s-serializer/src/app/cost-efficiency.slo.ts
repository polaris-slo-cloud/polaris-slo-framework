import {
    CostEfficiencySloMapping,
    CostEfficiencySloMappingSpec,
    HorizontalElasticityStrategyKind,
    RestServiceTarget,
} from '@sloc/common-mappings';
import { ApiObjectMetadata } from '@sloc/core';


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
            responseTimeThresholdMs: 25,
            targetCostEfficiency: 1000,
            minRequestsPercentile: 90,
        },
    }),
});
