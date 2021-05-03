import { SlocRuntime } from '@polaris-sloc/core';
import { KubeCostMetricSourceFactory, RestApiCostEfficiencyMetricSourceFactory } from './metrics';

/**
 * Initializes the CostEfficiency metrics and registers them with the `SlocRuntime`.
 *
 * @param runtime The `SlocRuntime` instance.
 */
export function initCostEfficiencyMetrics(runtime: SlocRuntime): void {
    runtime.metricsSourcesManager.addComposedMetricSourceFactory(new KubeCostMetricSourceFactory());
    runtime.metricsSourcesManager.addComposedMetricSourceFactory(new RestApiCostEfficiencyMetricSourceFactory());
}
