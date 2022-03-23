import { TotalCost, TotalCostMetric } from '@polaris-sloc/common-mappings';
import { ComposedMetricParams, ComposedMetricSource, ComposedMetricSourceFactory, MetricsSource, OrchestratorGateway } from '@polaris-sloc/core';
import { KubeCostMetricSource } from './kube-cost-metric-source';

/**
 * Factory for creating `KubeCostMetricSource` instances that supply metrics of type `TotalCostMetric`.
 *
 * This factory supports all `SloTarget` types.
 */
export class KubeCostMetricSourceFactory implements ComposedMetricSourceFactory<TotalCostMetric, TotalCost> {

    readonly metricType = TotalCostMetric.instance;

    readonly metricSourceName = `${TotalCostMetric.instance.metricTypeName}/kube-cost`;

    createSource(params: ComposedMetricParams, metricsSource: MetricsSource, orchestrator: OrchestratorGateway): ComposedMetricSource<TotalCost> {
        return new KubeCostMetricSource(params, metricsSource, orchestrator);
    }

}
