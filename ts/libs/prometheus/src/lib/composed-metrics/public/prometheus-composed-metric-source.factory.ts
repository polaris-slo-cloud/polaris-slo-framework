import {
    ComposedMetricMappingManager,
    ComposedMetricParams,
    ComposedMetricSource,
    ComposedMetricType,
    GenericComposedMetricSourceFactory,
    MetricsSource,
    OrchestratorGateway,
    POLARIS_API,
} from '@polaris-sloc/core';
import { PrometheusComposedMetricSource } from './prometheus-composed-metric-source';

/**
 * Generic factory for creating {@link PrometheusComposedMetricSource} instances that can supply any composed metric type.
 */
export class PrometheusComposedMetricSourceFactory implements GenericComposedMetricSourceFactory  {

    readonly metricSourceName =  POLARIS_API.METRICS_GROUP + '/*/prometheus-composed-metric-source';

    constructor(private composedMetricMappingManager: ComposedMetricMappingManager) {}

    createSource<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams>(
        metricType: M, params: P, metricsSource: MetricsSource, orchestrator: OrchestratorGateway,
    ): ComposedMetricSource<V> {
        return new PrometheusComposedMetricSource(metricType, params, this.composedMetricMappingManager, metricsSource, orchestrator);
    }

}
