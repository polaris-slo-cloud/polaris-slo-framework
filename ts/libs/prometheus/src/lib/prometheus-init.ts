import { Logger, PolarisRuntime } from '@polaris-sloc/core'
import { PrometheusComposedMetricSourceFactory } from './composed-metrics';
import { PrometheusConfig } from './config'
import { PrometheusTimeSeriesSource } from './time-series/public'

/**
 * Initializes the PrometheusQueryBackend and registers it with the `PolarisRuntime`.
 *
 * @param runtime The `PolarisRuntime` instance.
 * @param config The configuration for accessing Prometheus.
 * @param setAsDefaultSource If `true`, Prometheus will be set as the default `TimeSeriesSource` and as the composed metric fallback source.
 */
export function initPrometheusQueryBackend(runtime: PolarisRuntime, config: PrometheusConfig, setAsDefaultSource: boolean = false): void {
    Logger.log('Initializing PrometheusQueryBackend with config:', config);
    runtime.metricsSourcesManager.addTimeSeriesSource(new PrometheusTimeSeriesSource(config), setAsDefaultSource);

    if (setAsDefaultSource) {
        const mappingMgr = runtime.metricsSourcesManager.createComposedMetricMappingManager();
        runtime.metricsSourcesManager.setFallbackComposedMetricSourceFactory(new PrometheusComposedMetricSourceFactory(mappingMgr));
    }
}
