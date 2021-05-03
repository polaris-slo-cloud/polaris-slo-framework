import { PolarisRuntime } from '@polaris-sloc/core'
import { PrometheusConfig } from './config'
import { PrometheusTimeSeriesSource } from './time-series/public'

/**
 * Initializes the PrometheusQueryBackend and registers it with the `PolarisRuntime`.
 *
 * @param runtime The `PolarisRuntime` instance.
 * @param config The configuration for accessing Prometheus.
 * @param setAsDefaultSource If `true`, Prometheus will be set as the default `TimeSeriesSource`.
 */
export function initPrometheusQueryBackend(runtime: PolarisRuntime, config: PrometheusConfig, setAsDefaultSource: boolean = false): void {
    console.log('Initializing PrometheusQueryBackend with config:', config);
    runtime.metricsSourcesManager.addTimeSeriesSource(new PrometheusTimeSeriesSource(config), setAsDefaultSource);
}
