import { CpuUsageSloConfig } from '@polaris-sloc/common-mappings';
import {
    LabelFilters,
    MetricsSource,
    ObservableOrPromise,
    PolarisRuntime,
    ServiceLevelObjective,
    SloCompliance,
    SloMapping,
    SloOutput,
} from '@polaris-sloc/core';
import { of as observableOf } from 'rxjs';

export class CpuUsageSlo implements ServiceLevelObjective<CpuUsageSloConfig, SloCompliance>  {

    sloMapping: SloMapping<CpuUsageSloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    configure(
        sloMapping: SloMapping<CpuUsageSloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: PolarisRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;
        return observableOf(null);
    }

    evaluate(): ObservableOrPromise<SloOutput<SloCompliance>> {
        return this.calculateSloCompliance().then(compliance => ({
            sloMapping: this.sloMapping,
            elasticityStrategyParams: {
                currSloCompliancePercentage: compliance,
            },
        }));
    }

    private calculateSloCompliance(): Promise<number> {
        // const metricsSource = this.metricsSource;
        // metricsSource.getTimeSeriesSource()
        //     .select('gentics-mesh', 'http_requests_total', TimeRange.fromDuration(Duration.fromHours(1)))
        //     .filterOnLabel(LabelFilters.equal('method', 'POST'))
        //     .changeResolution(60)
        //     .execute()
        //     .then(results => {
        //         // ...
        //     }).catch(() => { /* ... */});

        return this.metricsSource.getTimeSeriesSource()
            .select<number>('container', 'cpu_load_average_10s')
            .filterOnLabel(LabelFilters.regex('pod', `${this.sloMapping.spec.targetRef.name}.*`))
            .execute()
            .then(result => {
                console.log(JSON.stringify(result, null, '    '));
                if (result.results.length === 0) {
                    throw new Error('Metric could not be read.');
                }

                let cpuAvg = result.results[0]?.samples[0].value ?? this.sloMapping.spec.sloConfig.targetAvgCPUUtilizationPercentage;
                if (cpuAvg === 0) {
                    cpuAvg = 1;
                }
                return this.sloMapping.spec.sloConfig.targetAvgCPUUtilizationPercentage / cpuAvg;
            });

        // const currSloCompliance = Math.ceil(Math.random() * UPPER_BOUND);
        // return currSloCompliance || LOWER_BOUND;
    }

}
