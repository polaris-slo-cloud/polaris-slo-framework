import { ComposedMetricParams, ComposedMetricSource, ComposedMetricType, GenericComposedMetricSourceFactory, PolarisRuntime } from '@polaris-sloc/core';
import { PrometheusComposedMetricSource } from './prometheus-composed-metric-source';

/**
 * Generic factory for creating {@link PrometheusComposedMetricSource} instances that can supply any composed metric type.
 */
export class PrometheusComposedMetricSourceFactory implements GenericComposedMetricSourceFactory  {

    readonly metricSourceName = 'metrics.polaris-slo-cloud.github.io/*/prometheus-composed-metric-source';

    createSource<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams>(
        metricType: M, params: P, polarisRuntime: PolarisRuntime,
    ): ComposedMetricSource<V> {
        return new PrometheusComposedMetricSource(metricType, params, polarisRuntime);
    }

}
