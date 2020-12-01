import { SloMappingSpec } from '../../../model';

/**
 * Describes the output of `ServiceLevelObjective.execute()`.
 *
 * @param T The type of `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
 */
export interface SloOutput<T> {

    /**
     * The `SloMappingSpec` that was used to configure this SLO.
     *
     * This contains information on the SLO target and the elasticity strategy to be used.
     */
    spec: SloMappingSpec<any, T, any>;

    /**
     * The `ElasticityStrategySpec.sloOutputParams` that should be submitted to the cluster.
     */
    elasticityStrategyParams: T;

    // We could use this to delete a strategy in the future.
    // deleteStrategy?: boolean;

}
