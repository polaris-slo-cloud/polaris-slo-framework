import { ElasticityStrategy } from '../../../model';
import { SloOutput } from '../../../slo';

/**
 * Exposes utility services for configuring and using elasticity strategies.
 */
export interface ElasticityStrategyService {

    /**
     * Creates a new `ElasticityStrategy` based on the `sloOutput`.
     *
     * This sets up the elasticity strategy kind, the SLO target ref, and the elasticity strategy spec automatically.
     *
     * @param name The name that should be assigned to `metadata.name`.
     * @param sloOutput The SLO ouput that should be used for setting up this `ElaticityStrategy`.
     * @returns A new `ElasticityStrategy` instance.
     */
    fromSloOutput<T>(name: string, sloOutput: SloOutput<T>): ElasticityStrategy<T>;

}
