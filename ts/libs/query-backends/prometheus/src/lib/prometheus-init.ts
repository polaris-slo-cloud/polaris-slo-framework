import { SlocRuntime } from '@sloc/core'
import { PrometheusConfig } from './config'
import { PrometheusTimeSeriesSource } from './time-series/public'

/**
 * Initializes the PrometheusQueryBackend and registers it with the `SlocRuntime`.
 *
 * @param runtime The `SlocRuntime` instance.
 * @param config The configuration for accessing Prometheus.
 * @param setAsDefaultSource If `true`, Prometheus will be set as the default `TimeSeriesSource`.
 */
export function initPrometheusQueryBackend(runtime: SlocRuntime, config: PrometheusConfig, setAsDefaultSource: boolean = false): void {
    runtime.metricsSourcesManager.addTimeSeriesSource(new PrometheusTimeSeriesSource(config), setAsDefaultSource);
}
