import { MetricsSource } from './metrics-source';
import { Constructor } from '../util';
import { KubernetesObject } from '@kubernetes/client-node';

const SLO_CONFIG_PROPERTY_NAME = '__slocSloConfig';

/**
 * Interface that every SLO must implement.
 *
 * @param C The type of the SloApplication CRD.
 * @param O The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 */
export interface ServiceLevelObjective<C extends KubernetesObject, O> {

    /**
     * The SloApplication resource used to configure this SLO instance.
     */
    readonly config: C;

    /**
     * Configures this SLO using an SloApplication resource and a metrics source.
     * @param sloApplication The SloApplication that describes the configuration for this instance.
     */
    configure(sloApplication: C, metricsSource: MetricsSource): Promise<void>;

    /**
     * Evaluates the SLO on the current system state
     */
    evaluate(): Promise<O>;

}

export interface SloConfiguration {
    elasticityStrategyApiVersion: string;
    elasticityStrategyKind: string;
}

/**
 * This decorator needs to be applied to every class that implements the `ServiceLevelObjective`.
 */
export function SLO<T extends ServiceLevelObjective<any, any>>(
    config: SloConfiguration,
): (sloClass: Constructor<T>) => void {
    return (sloClass: Constructor<T>) => {
        (sloClass as any)[SLO_CONFIG_PROPERTY_NAME] = config;
    }
}

export function getSloConfiguration(slo: ServiceLevelObjective<any, any>): SloConfiguration {
    return (slo as Object).constructor[SLO_CONFIG_PROPERTY_NAME];
}
