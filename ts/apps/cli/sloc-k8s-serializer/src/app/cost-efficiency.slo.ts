import {
    CostEfficiencySloConfig,
    CostEfficiencySloMapping,
    CostEfficiencySloMappingSpec,
    HorizontalElasticityStrategyKind,
    RestServiceTarget,
} from '@sloc/common-mappings';
import {
    ApiObjectMetadata,
    MetricsSource,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
    SlocRuntime,
} from '@sloc/core';


export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance> {

    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

    configure(sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>, metricsSource: MetricsSource, slocRuntime: SlocRuntime): Promise<void> {
        throw new Error('Method not implemented.');
    }

    evaluate(): Promise<SloOutput<SloCompliance>> {
        throw new Error('Method not implemented.');
    }

}

export default new CostEfficiencySloMapping({
    metadata: new ApiObjectMetadata({ name: 'data-service-cost-efficiency' }),
    spec: new CostEfficiencySloMappingSpec({
        targetRef: new RestServiceTarget({
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
