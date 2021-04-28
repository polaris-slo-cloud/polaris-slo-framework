import { CostEfficiencyMetric, CostEfficiencyParams, CostEfficiencySloConfig } from '@sloc/common-mappings';
import { MetricsSource, ObservableOrPromise, ServiceLevelObjective, SloCompliance, SloMapping, SloOutput, SlocRuntime } from '@sloc/core';
import { of as observableOf } from 'rxjs';

/**
 * Implements the actual SLO that evaluates cost efficiency.
 */
export class CostEfficiencySlo implements ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance>  {

    sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>;

    private metricsSource: MetricsSource;

    private costEfficiencyParams: CostEfficiencyParams;
    private minRequestsPercentile: number;

    configure(
        sloMapping: SloMapping<CostEfficiencySloConfig, SloCompliance>,
        metricsSource: MetricsSource,
        slocRuntime: SlocRuntime,
    ): ObservableOrPromise<void> {
        this.sloMapping = sloMapping;
        this.metricsSource = metricsSource;

        this.costEfficiencyParams = {
            sloTarget: sloMapping.spec.targetRef,
            namespace: sloMapping.metadata.namespace,
            targetThreshold: sloMapping.spec.sloConfig.responseTimeThresholdMs,
        };

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
        const costEffMetric = this.metricsSource.getComposedMetricSource(CostEfficiencyMetric.instance, this.costEfficiencyParams);
        const costEff = await costEffMetric.getCurrentValue().toPromise();

        if (costEff.value.totalCost.currentCostPerHour === 0 || costEff.value.percentileBetterThanThreshold >= this.minRequestsPercentile) {
            return 100;
        }

        if (costEff.value.costEfficiency === 0) {
            return 200;
        }

        const compliance = (this.sloMapping.spec.sloConfig.targetCostEfficiency / costEff.value.costEfficiency) * 100
        return Math.ceil(compliance);
    }

}
