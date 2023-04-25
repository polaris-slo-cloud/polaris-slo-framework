import { ElasticityStrategyKind, SloMapping } from '../../../model';

/**
 * Describes the output of `ServiceLevelObjective.execute()`.
 *
 * @param T The type of `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
 */
export interface SloOutput<T> {

    /**
     * The `SloMapping` that was used to configure this SLO.
     *
     * This contains information on the SLO target and the elasticity strategy to be used.
     */
    sloMapping: SloMapping<any, T>;

    /**
     * The `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
     */
    elasticityStrategyParams: T;

    /**
     * (optional) The `ElasticityStrategyKind` that identifies the ElasticityStrategy that should be triggered.
     *
     * This only needs to be set, if an ElasticityStrategy other than the default strategy specified in the `SloMapping` should be triggered.
     */
    elasticityStrategy?: ElasticityStrategyKind<T>;

    /**
     * (optional) Static configuration for the `ElasticityStrategy`.
     *
     * This only needs to be set, if other values than the default ones specified in the `SloMapping` should be used.
     */
    staticElasticityStrategyConfig?: any;

    // We could use this to delete a strategy in the future.
    // deleteStrategy?: boolean;

}
