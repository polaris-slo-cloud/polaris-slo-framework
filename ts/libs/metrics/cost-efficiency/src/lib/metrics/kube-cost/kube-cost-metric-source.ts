import { TotalCost } from '@sloc/common-mappings';
import { LabelFilters, MetricsSource, PolishedMetricParams, PolishedMetricSourceBase, Sample, SlocRuntime, TimeSeriesInstant } from '@sloc/core';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

function getHourlyGbMemoryCost(): number {
    return 0.1;
}

function getHourlyCpuCost(): number {
    return 0.2;
}

/**
 * Provides the total cost of a `SloTarget` using KubeCost.
 *
 * ToDo: implement the KubeCost part (currently the hourly costs are mocked).
 */
export class KubeCostMetricSource extends PolishedMetricSourceBase<TotalCost> {

    private metricsSource: MetricsSource;

    constructor(private params: PolishedMetricParams, slocRuntime: SlocRuntime) {
        super(slocRuntime);
        this.metricsSource = slocRuntime.metricsSourcesManager;
    }

    getValueStream(): Observable<Sample<TotalCost>> {
        return this.getDefaultPollingInterval().pipe(
            switchMap(() => this.getCost()),
            map(totalCost => ({
                value: totalCost,
                timestamp: new Date().valueOf(),
            })),
        );
    }

    private async getCost(): Promise<TotalCost> {
        const memoryUsageBytesQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('container', 'memory_working_set_bytes')
            .filterOnLabel(LabelFilters.equal('namespace', this.params.namespace))
            .sumByGroup('pod');

        const cpuUsageSecondsSumQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('node', 'namespace_pod_container:container_cpu_usage_seconds_total:sum_rate')
            .filterOnLabel(LabelFilters.equal('namespace', this.params.namespace))
            .sumByGroup('pod');

        const [ memoryUsageBytesResult, cpuUsageSecondsSumResult ] = await Promise.all([
            memoryUsageBytesQuery.execute(),
            cpuUsageSecondsSumQuery.execute(),
        ]);

        const totalMemoryUsageGb = this.sumResults(memoryUsageBytesResult.results) / 1024 / 1024 / 1024;
        const totalCpu = this.sumResults(cpuUsageSecondsSumResult.results);

        const memoryCost = totalMemoryUsageGb * getHourlyGbMemoryCost();
        const cpuCost = totalCpu * getHourlyCpuCost();

        return {
            currentCostPerHour: memoryCost + cpuCost,
            accumulatedCostInPeriod: memoryCost + cpuCost,
        };
    }

    private sumResults(results: TimeSeriesInstant<number>[]): number {
        let sum = 0;
        results.forEach(result => sum += result.samples[0].value);
        return sum;
    }

}
