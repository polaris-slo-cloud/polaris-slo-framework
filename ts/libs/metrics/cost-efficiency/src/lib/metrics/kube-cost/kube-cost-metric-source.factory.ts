import { TotalCost, TotalCostMetric } from '@sloc/common-mappings';
import { PolishedMetricParams, PolishedMetricSource, PolishedMetricSourceFactory, SlocRuntime } from '@sloc/core';
import { KubeCostMetricSource } from './kube-cost-metric-source';

/**
 * Factory for creating `KubeCostMetricSource` instances that supply metrics of type `TotalCostMetric`.
 */
export class KubeCostMetricSourceFactory implements PolishedMetricSourceFactory<TotalCostMetric, TotalCost> {

    readonly metricType = TotalCostMetric.instance;

    readonly metricSourceName = KubeCostMetricSource.metricSourceName;

    createSource(params: PolishedMetricParams, slocRuntime: SlocRuntime): PolishedMetricSource<TotalCost> {
        return new KubeCostMetricSource(params, slocRuntime);
    }

}
