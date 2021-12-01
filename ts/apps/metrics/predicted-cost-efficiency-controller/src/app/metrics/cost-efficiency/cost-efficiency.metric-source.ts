// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CostEfficiency, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ComposedMetricSourceBase, MetricsSource, OrchestratorGateway, Sample } from '@polaris-sloc/core';
import Axios from 'axios-observable';
import { Observable } from 'rxjs';
import { map, withLatestFrom } from 'rxjs/operators';
// ToDo:
// 1. Adapt the list of `supportedSloTargetTypes` in `CostEfficiencyMetricSourceFactory` (see cost-efficiency.metric-source.factory.ts).
// 2. Adapt the `CostEfficiencyMetricSourceFactory.metricSourceName`, if needed (e.g., if there are multiple sources for CostEfficiencyMetric that differ
//    based on the supported SloTarget types).
// 3. Implement `CostEfficiencyMetricSource.getValueStream()` to compute the metric.
// 4. Adapt the `release` label in `../../../../manifests/kubernetes/3-service-monitor.yaml` to ensure that Prometheus will scrape this controller.

/**
 * Computes the `CostEfficiency` composed metric.
 */
export class CostEfficiencyMetricSource extends ComposedMetricSourceBase<CostEfficiency> {
    constructor(private params: CostEfficiencyParams, metricsSource: MetricsSource, orchestrator: OrchestratorGateway) {
        super(metricsSource, orchestrator);
    }

    getValueStream(): Observable<Sample<CostEfficiency>> {
        const a = {
            timestamp: Math.floor(Date.now() / 1000),
            value: {
                costEfficiency: 1,
                percentileBetterThanThreshold: -1,
                totalCost: { currentCostPerHour: -1, accumulatedCostInPeriod: -1 },
            },
        };
        return this.getDefaultPollingInterval().pipe(
            withLatestFrom(Axios.get('https://jsonplaceholder.typicode.com/todos/1')),
            map(b => a),
        );
    }
}
