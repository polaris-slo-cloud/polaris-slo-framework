import { CostEfficiency, CostEfficiencyMetric, CostEfficiencyParams } from '@sloc/common-mappings';
import { PolishedMetricSource, PolishedMetricSourceFactory, SlocRuntime } from '@sloc/core';
import { RestApiCostEfficiencyMetricSource } from './rest-api-cost-efficiency-metric-source';

/**
 * Factory for creating `RestApiCostEfficiencyMetricSource` instances that supply metrics of type `CostEfficiencyMetric`.
 */
export class RestApiCostEfficiencyMetricSourceFactory implements PolishedMetricSourceFactory<CostEfficiencyMetric, CostEfficiency, CostEfficiencyParams> {

    readonly metricType = CostEfficiencyMetric.instance;

    readonly metricSourceName = `${CostEfficiencyMetric.instance.metricTypeName}/rest-api-cost-efficiency`;

    createSource(params: CostEfficiencyParams, slocRuntime: SlocRuntime): PolishedMetricSource<CostEfficiency> {
        return new RestApiCostEfficiencyMetricSource(params, slocRuntime);
    }

}
