import { CostEfficiencySloConfig } from '@sloc/common-mappings';
import {
    LabelFilters,
    MetricsSource,
    ObservableOrPromise,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
    SlocRuntime,
    TimeRange,
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
        const responseTime = await this.getResponseTime();
        const cost = await this.getCost();

        return responseTime / cost;
    }

    private async getResponseTime(): Promise<number> {
        const reqDurationsQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_sum')
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`));

        const reqCountQuery = this.metricsSource.getTimeSeriesSource()
            .select<number>('nginx', 'ingress_controller_request_duration_seconds_count')
            .filterOnLabel(LabelFilters.regex('ingress', `${this.sloMapping.spec.targetRef.name}.*`));

        const reqDurationsResult = await reqDurationsQuery.execute();
        const reqCountResult = await reqCountQuery.execute();

        const reqDurations = reqDurationsResult.results[0]?.samples[0]?.value ?? 0;
        const reqCount = reqCountResult.results[0]?.samples[0]?.value ?? 0;

        if (reqCount === 0) {
            return 0;
        }
        return (reqDurations / reqCount) * 1000;
    }

    private getCost(): Promise<number> {
        // ToDo
        return Promise.resolve(Math.ceil(Math.random() * UPPER_BOUND));
    }

}
