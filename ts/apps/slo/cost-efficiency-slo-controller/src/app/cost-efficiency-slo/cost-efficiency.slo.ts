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

const LOWER_BOUND = 1;
const UPPER_BOUND = 200;

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
        const responseTime = this.getResponseTime();
        const cost = this.getCost();

        return await responseTime / await cost;
    }

    private async getResponseTime(): Promise<number> {
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

    private getCost(): Promise<number> {
        // ToDo
        return Promise.resolve(Math.ceil(Math.random() * UPPER_BOUND));
    }

}
