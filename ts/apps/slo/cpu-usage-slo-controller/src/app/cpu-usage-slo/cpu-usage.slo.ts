import { CpuUsageSloConfig } from '@sloc/common-mappings';
import {
    Duration,
    LabelFilters,
    MetricsSource,
    ObservableOrPromise,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloMappingSpec,
    SloOutput,
    SlocRuntime,
    TimeRange,
} from '@sloc/core';
import { of as observableOf } from 'rxjs';

const LOWER_BOUND = 1;
const UPPER_BOUND = 200;

export class CpuUsageSlo implements ServiceLevelObjective<CpuUsageSloConfig, SloCompliance>  {

    sloMapping: SloMapping<CpuUsageSloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    configure(
        sloMapping: SloMapping<CpuUsageSloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: SlocRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;
        return observableOf(null);
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        return Promise.resolve({
            sloMapping: this.sloMapping,
            elasticityStrategyParams: {
                currSloCompliancePercentage: this.calculateSloCompliance(),
            },
        });
    }

    private calculateSloCompliance(): number {
        // const metricsSource = this.metricsSource;
        // metricsSource.getTimeSeriesSource()
        //     .select('gentics-mesh', 'http_requests_total', TimeRange.fromDuration(Duration.fromHours(1)))
        //     .filterOnLabel(LabelFilters.equal('method', 'POST'))
        //     .changeResolution(60)
        //     .execute()
        //     .then(results => {
        //         // ...
        //     }).catch(() => { /* ... */});


        const currSloCompliance = Math.ceil(Math.random() * UPPER_BOUND);
        return currSloCompliance || LOWER_BOUND;
    }

}
