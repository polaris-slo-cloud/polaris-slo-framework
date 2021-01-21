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
    return 0.1;
}

function getHourlyCpuCost(): number {
    return 0.2;
}

interface RequestsFasterThanThresholdInfo {

    /** The percentile of requests that are faster than the threshold. */
    percentileFaster: number;

    /** The absolute number of requests that are faster than the threshold. */
    totalReqFaster: number

}

export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance>  {

    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    private targetThresholdSecStr: string;
    private minRequestsPercentile: number;

    configure(
        sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: SlocRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;

        this.targetThresholdSecStr = (sloMapping.spec.sloConfig.responseTimeThresholdMs / 1000).toString();
        if (typeof sloMapping.spec.sloConfig.minRequestsPercentile === 'number') {
            this.minRequestsPercentile = sloMapping.spec.sloConfig.minRequestsPercentile / 100;
        } else {
            this.minRequestsPercentile = 0.9;
        }

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
        const requestsInfo = await this.getPercentileFasterThanThreshold();
        const cost = await this.getCost();

        if (cost === 0 || requestsInfo.percentileFaster >= this.minRequestsPercentile) {
            return 100;
        }

        const costEff = requestsInfo.totalReqFaster / cost;
        if (costEff === 0) {
            return 200;
        }

        const compliance = (this.sloMapping.spec.sloConfig.targetCostEfficiency / costEff) * 100
        return Math.ceil(compliance);
    }

    private async getPercentileFasterThanThreshold(): Promise<RequestsFasterThanThresholdInfo> {
        const fasterThanBucketQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_bucket', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
            .filterOnLabel(LabelFilters.equal('le', this.targetThresholdSecStr))
            .rate()
            .sumByGroup('path');

        const reqCountQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_count', TimeRange.fromDuration(Duration.fromMinutes(1)))
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`))
            .rate()
            .sumByGroup('path');

        const fasterThanBucketResult = await fasterThanBucketQuery.execute();
        const reqCountResult = await reqCountQuery.execute();

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
