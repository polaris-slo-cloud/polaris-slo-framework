import { ElasticityStrategy, SloCompliance, SloTarget } from '../../../../../model';
import { ElasticityStrategyController } from '../../../common';

/**
 * Common superclass for elasticity strategy controllers that expect `SloCompliance` objects as input.
 *
 * This class implements `checkIfActionNeeded()` for `SloCompliance` values.
 */
export abstract class SloComplianceElasticityStrategyControllerBase<T extends SloTarget = SloTarget, C = Record<string, any>>
    implements ElasticityStrategyController<SloCompliance, T, C> {

    abstract execute(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<void>;

    abstract onElasticityStrategyDeleted?(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): void;

    abstract onDestroy?(): void;

    checkIfActionNeeded(elasticityStrategy: ElasticityStrategy<SloCompliance, T, C>): Promise<boolean> {
        const sloCompliance = elasticityStrategy.spec.sloOutputParams;
        const tolerance = sloCompliance.tolerance ?? this.getDefaultTolerance();
        const lowerBound = 100 - tolerance;
        const upperBound = 100 + tolerance;

        const actionNeeded = sloCompliance.currSloCompliancePercentage < lowerBound || sloCompliance.currSloCompliancePercentage > upperBound;
        return Promise.resolve(actionNeeded);
    }

    /**
     * @returns The default tolerance value if `SloCompliance.tolerance` is not set for an elasticity strategy.
     */
    protected getDefaultTolerance(): number {
        return 10;
    }

}
