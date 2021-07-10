import {
    Container,
    ElasticityStrategy,
    Resources,
    SloCompliance,
    SloTarget,
    VerticalElasticityStrategyConfig,
    VerticalElasticityStrategyControllerBase,
} from '@polaris-sloc/core';

/**
 * Performs simple vertical scaling of a workload.
 */
export class VerticalElasticityStrategyController extends VerticalElasticityStrategyControllerBase<SloTarget, VerticalElasticityStrategyConfig> {

    computeResources(
        elasticityStrategy: ElasticityStrategy<SloCompliance, SloTarget, VerticalElasticityStrategyConfig>,
        container: Container,
    ): Promise<Resources> {
        throw new Error('Method not implemented.');
    }

}
