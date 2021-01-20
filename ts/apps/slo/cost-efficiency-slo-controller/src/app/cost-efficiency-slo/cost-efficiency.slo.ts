import { CostEfficiencySloConfig } from '@sloc/common-mappings';
import {
    Duration,
    LabelFilters,
    MetricsSource,
    ObservableOrPromise,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
    SlocRuntime,
    TimeRange,
    TimeSeriesInstant,
} from '@sloc/core';
import { of as observableOf } from 'rxjs';

function getHourlyGbMemoryCost(): number {
    return 1;
}

function getHourlyCpuCost(): number {
    return 2;
}

export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance>  {

    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    configure(
        sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: SlocRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;
        return observableOf(null);
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        return this.calculateSloCompliance()
            .then(sloCompliance => ({
                sloMapping: this.sloMapping,
                elasticityStrategyParams: {
                    currSloCompliancePercentage: sloCompliance,
                },
            }));
    }

    private async calculateSloCompliance(): Promise<number> {
        const avgResponseTime = await this.getAvgResponseTime() || 1;
        const cost = await this.getCost();

        if (cost === 0) {
            return 100;
        }

        const costEff = 1 / (avgResponseTime / cost);
        const compliance = (costEff / this.sloMapping.spec.sloConfig.targetCostEfficiency) * 100
        return Math.ceil(compliance);
    }

    private async getAvgResponseTime(): Promise<number> {
        const reqDurationsQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_sum', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
            .rate()
            .sumByGroup('path');

        const reqCountQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_count', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
            .rate()
            .sumByGroup('path');

        const reqDurationsResult = await reqDurationsQuery.execute();
        const reqCountResult = await reqCountQuery.execute();

        const reqDurationsSum = this.sumResults(reqDurationsResult.results);
        const totalReqCount = this.sumResults(reqCountResult.results);

        if (totalReqCount === 0) {
            return 0;
        }
        return (reqDurationsSum / totalReqCount) * 1000;
    }

    private sumResults(results: TimeSeriesInstant<number>[]): number {
        let sum = 0;
        results.forEach(result => sum += result.samples[0].value);
        return sum;
    }

    private async getCost(): Promise<number> {
        const memoryUsageBytesQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('container', 'memory_working_set_bytes')
            .filterOnLabel(LabelFilters.equal('namespace', this.sloMapping.metadata.namespace))
            .sumByGroup('pod');

        const cpuUsageSecondsSumQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('node', 'namespace_pod_container:container_cpu_usage_seconds_total:sum_rate')
            .filterOnLabel(LabelFilters.equal('namespace', this.sloMapping.metadata.namespace))
            .sumByGroup('pod');

        const memoryUsageBytesResult = await memoryUsageBytesQuery.execute();
        const cpuUsageSecondsSumResult = await cpuUsageSecondsSumQuery.execute();

        const totalMemoryUsageGb = this.sumResults(memoryUsageBytesResult.results) / 1024 / 1024 / 1024;
        const totalCpu = this.sumResults(cpuUsageSecondsSumResult.results);

        const memoryCost = totalMemoryUsageGb * getHourlyGbMemoryCost();
        const cpuCost = totalCpu * getHourlyCpuCost();
        return memoryCost + cpuCost;
    }

}
