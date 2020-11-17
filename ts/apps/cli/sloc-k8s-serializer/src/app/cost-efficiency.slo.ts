import { CostEfficiencySloConfig, CostEfficiencySloMapping, CostEfficiencySloMappingSpec, HorizontalElasticityStrategyKind } from '@sloc/common-mappings';
import { ApiObjectMetadata, MetricsSource, ServiceLevelObjective, SloCompliance, SloMappingSpec, SloOutput, SloTarget, SlocRuntime } from '@sloc/core';


export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance> {

    spec: SloMappingSpec<CostEfficiencySloConfig, SloCompliance>;

    configure(spec: SloMappingSpec<CostEfficiencySloConfig, SloCompliance>, metricsSource: MetricsSource, slocRuntime: SlocRuntime): Promise<void> {
        throw new Error('Method not implemented.');
    }

    evaluate(): Promise<SloOutput<SloCompliance>> {
        throw new Error('Method not implemented.');
    }

}

export default new CostEfficiencySloMapping({
    metadata: new ApiObjectMetadata({ name: 'data-service-cost-efficiency' }),
    spec: new CostEfficiencySloMappingSpec({
        targetRef: new SloTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'data-service',
        }),
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        sloConfig: {
            responseTimeThresholdMs: 400,
            targetCostEfficiency: 1000,
            minRequestsPercentile: 90,
        },
    }),
});
