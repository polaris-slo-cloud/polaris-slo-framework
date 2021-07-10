import {
    ElasticityStrategy,
    HorizontalElasticityStrategyConfig,
    HorizontalElasticityStrategyControllerBase,
    Scale,
    SloCompliance,
    SloTarget,
} from '@polaris-sloc/core';

/**
 * Performs simple horizontal scaling of a workload.
 */
export class HorizontalElasticityStrategyController extends HorizontalElasticityStrategyControllerBase<SloTarget, HorizontalElasticityStrategyConfig> {

    protected computeScale(
        elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, HorizontalElasticityStrategyConfig>,
        currScale: Scale,
    ): Promise<Scale> {
        const newScale = new Scale(currScale);
        const multiplier = elasticityStrategy.spec.sloOutputParams.currSloCompliancePercentage / 100;
        newScale.spec.replicas = Math.ceil(currScale.spec.replicas * multiplier);
        return Promise.resolve(newScale);
    }

}
