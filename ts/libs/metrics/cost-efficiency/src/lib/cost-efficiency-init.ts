import { SlocRuntime } from '@sloc/core';
import { KubeCostMetricSourceFactory, RestApiCostEfficiencyMetricSourceFactory } from './metrics';

/**
 * Initializes the CostEfficiency metrics and registers them with the `SlocRuntime`.
 *
 * @param runtime The `SlocRuntime` instance.
 */
export function initCostEfficiencyMetrics(runtime: SlocRuntime): void {
    runtime.metricsSourcesManager.addPolishedMetricSourceFactory(new KubeCostMetricSourceFactory());
    runtime.metricsSourcesManager.addPolishedMetricSourceFactory(new RestApiCostEfficiencyMetricSourceFactory());
}
