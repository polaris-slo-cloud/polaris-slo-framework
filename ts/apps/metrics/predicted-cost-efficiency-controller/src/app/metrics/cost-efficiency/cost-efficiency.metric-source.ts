// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { CostEfficiency, CostEfficiencyParams } from '@polaris-sloc/common-mappings';
// eslint-disable-next-line @nrwl/nx/enforce-module-boundaries
import { ComposedMetricSourceBase, MetricsSource, OrchestratorGateway, Sample } from '@polaris-sloc/core';
import axios from 'axios';
import { Observable } from 'rxjs';
import { map, mergeMap, switchMap, withLatestFrom } from 'rxjs/operators';
import { getEnvironmentVariable } from '../../util/environment-var-helper';
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
    private readonly baseUrl: string;

    constructor(private params: CostEfficiencyParams, metricsSource: MetricsSource, orchestrator: OrchestratorGateway) {
        super(metricsSource, orchestrator);
        this.baseUrl = getEnvironmentVariable('PREDICTION_SERVICE_BASE_URL');
        if (this.baseUrl == null) {
            this.baseUrl = 'predicted-metrics-container:5000';
        }
        console.log(`Using ${this.baseUrl} as baseUrl.`);
    }

    getValueStream(): Observable<Sample<CostEfficiency>> {
        return this.getDefaultPollingInterval().pipe(
            switchMap(() => call(this.baseUrl)),
            map(mapResponseToSample),
        );
    }
}

interface PredictionApiResponse {
    predictions: number[];
}

async function call(baseUrl: string): Promise<PredictionApiResponse> {
    const response = await axios.get<PredictionApiResponse>(baseUrl);
    console.log(response.data);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return Promise.resolve(response.data);
}

function mapResponseToSample(response: PredictionApiResponse): Sample<CostEfficiency> {
    console.log(response);
    const a = {
        timestamp: Math.floor(Date.now() / 1000),
        value: {
            costEfficiency: response.predictions[0],
            percentileBetterThanThreshold: -1,
            totalCost: { currentCostPerHour: -1, accumulatedCostInPeriod: -1 },
        },
    };
    return a;
}
