import { CostEfficiency, CostEfficiencyMetric, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
import { ComposedMetricSource, ComposedMetricSourceFactory, PolarisRuntime } from '@polaris-sloc/core';
import { RestApiCostEfficiencyMetricSource } from './rest-api-cost-efficiency-metric-source';

/**
 * Factory for creating `RestApiCostEfficiencyMetricSource` instances that supply metrics of type `CostEfficiencyMetric`.
 */
export class RestApiCostEfficiencyMetricSourceFactory implements ComposedMetricSourceFactory<CostEfficiencyMetric, CostEfficiency, CostEfficiencyParams> {

    readonly metricType = CostEfficiencyMetric.instance;

    readonly metricSourceName = `${CostEfficiencyMetric.instance.metricTypeName}/rest-api-cost-efficiency`;

    createSource(params: CostEfficiencyParams, polarisRuntime: PolarisRuntime): ComposedMetricSource<CostEfficiency> {
        return new RestApiCostEfficiencyMetricSource(params, polarisRuntime);
    }

}
