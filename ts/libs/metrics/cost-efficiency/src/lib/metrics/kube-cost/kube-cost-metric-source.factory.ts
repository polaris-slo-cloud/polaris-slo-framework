import { TotalCost, TotalCostMetric } from '@polaris-sloc/common-mappings';
import { ComposedMetricParams, ComposedMetricSource, ComposedMetricSourceFactory, PolarisRuntime } from '@polaris-sloc/core';
import { KubeCostMetricSource } from './kube-cost-metric-source';

/**
 * Factory for creating `KubeCostMetricSource` instances that supply metrics of type `TotalCostMetric`.
 */
export class KubeCostMetricSourceFactory implements ComposedMetricSourceFactory<TotalCostMetric, TotalCost> {

    readonly metricType = TotalCostMetric.instance;

    readonly metricSourceName = `${TotalCostMetric.instance.metricTypeName}/kube-cost`;

    createSource(params: ComposedMetricParams, polarisRuntime: PolarisRuntime): ComposedMetricSource<TotalCost> {
        return new KubeCostMetricSource(params, polarisRuntime);
    }

}
