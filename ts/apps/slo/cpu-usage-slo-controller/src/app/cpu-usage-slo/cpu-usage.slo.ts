import { CpuUsageSloMapping, SLOC_API_VERSION, SloComplianceElasticityStrategyData } from '../model';
import { MetricsSource, SLO, ServiceLevelObjective } from '../sloc-policy-language';

const LOWER_BOUND = 1;
const TARGET_COMPLIANCE = 100;
const UPPER_BOUND = 200;
const TOLERANCE = 1;

@SLO({})
export class CpuUsageSlo implements ServiceLevelObjective<CpuUsageSloMapping, SloComplianceElasticityStrategyData> {

    config: CpuUsageSloMapping;
    private metricsSrc: MetricsSource;

    configure(sloMapping: CpuUsageSloMapping, metricsSource: MetricsSource): Promise<void> {
        this.config = sloMapping;
        this.metricsSrc = metricsSource;
        return Promise.resolve();
    }

    evaluate(): Promise<SloComplianceElasticityStrategyData> {
        return Promise.resolve({
            targetRef: this.config.spec.targetRef,
            sloTargetCompliance: TARGET_COMPLIANCE,
            tolerance: TOLERANCE,
            currSloCompliance: this.calculateSloCompliance(),
        });
    }

    private calculateSloCompliance(): number {
        // Get some metrics.
        // Do some calculations, based on sloMapping.spec

        const currSloCompliance = Math.ceil(Math.random() * UPPER_BOUND);
        return currSloCompliance || LOWER_BOUND;
    }

}
