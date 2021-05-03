import { PolarisRuntime } from '@polaris-sloc/core';
import { KubeCostMetricSourceFactory, RestApiCostEfficiencyMetricSourceFactory } from './metrics';

/**
 * Initializes the CostEfficiency metrics and registers them with the `PolarisRuntime`.
 *
 * @param runtime The `PolarisRuntime` instance.
 */
export function initCostEfficiencyMetrics(runtime: PolarisRuntime): void {
    runtime.metricsSourcesManager.addComposedMetricSourceFactory(new KubeCostMetricSourceFactory());
    runtime.metricsSourcesManager.addComposedMetricSourceFactory(new RestApiCostEfficiencyMetricSourceFactory());
}
