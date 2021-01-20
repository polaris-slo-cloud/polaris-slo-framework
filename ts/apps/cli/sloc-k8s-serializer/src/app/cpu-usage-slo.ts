import { CpuUsageSloMapping, CpuUsageSloMappingSpec, HorizontalElasticityStrategyKind } from '@sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@sloc/core';

export default new CpuUsageSloMapping({
    metadata: new ApiObjectMetadata({
        name: 'my-slo',
    }),
    spec: new CpuUsageSloMappingSpec({
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        targetRef: new SloTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'twitter-clone',
        }),
        sloConfig: {
            targetAvgCPUUtilizationPercentage: 80,
        },
    }),
});
