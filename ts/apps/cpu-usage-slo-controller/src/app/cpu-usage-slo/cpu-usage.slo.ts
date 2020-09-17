import { ServiceLevelObjective, MetricsSource, SLO } from '../sloc-policy-language';
import { CpuUsageSloApplication, SloComplianceElasticityStrategyData, SLOC_API_VERSION } from '../model';

const LOWER_BOUND = 1;
const TARGET_COMPLIANCE = 100;
const UPPER_BOUND = 200;
const TOLERANCE = 1;

@SLO({
    elasticityStrategyApiVersion: SLOC_API_VERSION,
    elasticityStrategyKind: 'HorizontalElasticityStrategy',
})
export class CpuUsageSlo implements ServiceLevelObjective<CpuUsageSloApplication, SloComplianceElasticityStrategyData> {

    private sloApplication: CpuUsageSloApplication
    private metricsSrc: MetricsSource;

    configure(sloApplication: CpuUsageSloApplication, metricsSource: MetricsSource): Promise<void> {
        this.sloApplication = sloApplication;
        this.metricsSrc = metricsSource;
        return Promise.resolve();
    }

    evaluate(): Promise<SloComplianceElasticityStrategyData> {
        return Promise.resolve({
            targetRef: this.sloApplication.spec.targetRef,
            sloTargetCompliance: TARGET_COMPLIANCE,
            tolerance: TOLERANCE,
            currSloCompliance: this.calculateSloCompliance(),
        });
    }

    private calculateSloCompliance(): number {
        // Get some metrics.
        // Do some calculations, based on sloApplication.spec

        const currSloCompliance = Math.ceil(Math.random() * UPPER_BOUND);
        return currSloCompliance || LOWER_BOUND;
    }

}
