import { MetricsSource, ServiceLevelObjective, SloCompliance, SloMappingSpec, SloOutput, SlocRuntime } from '@sloc/core';

export interface CostEfficiencySloConfig {

    responseTimeThresholdMs: number;

    targetCostEfficiency: number;

    minRequestsPercentile?: number;

}

export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance> {

    spec: SloMappingSpec<CostEfficiencySloConfig, SloCompliance>;

    configure(spec: SloMappingSpec<CostEfficiencySloConfig, SloCompliance>, metricsSource: MetricsSource, slocRuntime: SlocRuntime): Promise<void> {
        throw new Error('Method not implemented.');
    }

    evaluate(): Promise<SloOutput<SloCompliance>> {
        throw new Error('Method not implemented.');
    }

}
