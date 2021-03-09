import { CostEfficiency, CostEfficiencyParams, TotalCost, TotalCostMetric } from '@sloc/common-mappings';
import { Duration, LabelFilters, MetricsSource, PolishedMetricSourceBase, Sample, SlocRuntime, TimeRange, TimeSeriesInstant } from '@sloc/core';
import { Observable, interval } from 'rxjs';
import { map, switchMap, withLatestFrom } from 'rxjs/operators';

const STREAM_INTERVAL_MSEC = 10000;

interface RequestsFasterThanThresholdInfo {

    /** The percentile of requests that are faster than the threshold. */
    percentileFaster: number;

    /** The absolute number of requests that are faster than the threshold. */
    totalReqFaster: number

}

/**
 * Provides the `CostEfficiency` metric for an `SloTarget` with a REST API.
 *
 * The `CostEfficiencyParams.targetThreshold` specifies the response time in milliseconds that
 * the REST API requests should have at most.
 */
export class RestApiCostEfficiencyMetricSource extends PolishedMetricSourceBase<CostEfficiency> {

    private metricsSource: MetricsSource;
    private targetThresholdSecStr: string;

    constructor(private params: CostEfficiencyParams, slocRuntime: SlocRuntime) {
        super();
        this.metricsSource = slocRuntime.metricsSourcesManager;
        this.targetThresholdSecStr = (params.targetThreshold / 1000).toString();
    }

    getValueStream(): Observable<Sample<CostEfficiency>> {
        const costSource = this.metricsSource.getPolishedMetricSource(TotalCostMetric.instance, { ...this.params }, this.params.costMetricSourceName);

        return interval(STREAM_INTERVAL_MSEC).pipe(
            switchMap(() => this.getPercentileFasterThanThreshold()),
            withLatestFrom(costSource.getValueStream()),
            map(([ reqFasterThan, totalCost ]) => ({
                value: this.computeCostEfficiency(reqFasterThan, totalCost.value),
                timestamp: new Date().valueOf(),
            })),
        );
    }

    private computeCostEfficiency(reqFasterThan: RequestsFasterThanThresholdInfo, totalCost: TotalCost): CostEfficiency {
        return {
            costEfficiency: reqFasterThan.totalReqFaster / totalCost.currentCostPerHour,
            percentileBetterThanThreshold: reqFasterThan.percentileFaster,
            totalCost,
        };
    }

    private async getPercentileFasterThanThreshold(): Promise<RequestsFasterThanThresholdInfo> {
        const fasterThanBucketQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_bucket', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.params.sloTarget.name}.*`))
            .filterOnLabel(LabelFilters.equal('le', this.targetThresholdSecStr))
            .rate()
            .sumByGroup('path');

        const reqCountQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_count', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.params.sloTarget.name}.*`))
            .rate()
            .sumByGroup('path');

        const [ fasterThanBucketResult, reqCountResult ] = await Promise.all([ fasterThanBucketQuery.execute(), reqCountQuery.execute() ]);

        const totalReqFasterThanThreshold = this.sumResults(fasterThanBucketResult.results);
        const totalReqCount = this.sumResults(reqCountResult.results);

        if (totalReqCount === 0) {
            return {
                percentileFaster: 1,
                totalReqFaster: 0,
            };
        }
        return {
            percentileFaster: totalReqFasterThanThreshold / totalReqCount,
            totalReqFaster: totalReqFasterThanThreshold,
        };
    }

    private sumResults(results: TimeSeriesInstant<number>[]): number {
        let sum = 0;
        results.forEach(result => sum += result.samples[0].value);
        return sum;
    }

}
