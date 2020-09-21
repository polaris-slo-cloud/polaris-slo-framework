import { MetricsSource } from './metrics-source';
import { Constructor } from '../util';
import { SloMapping, KubernetesObjectWithSpec } from '../model';

const SLO_CONFIG_PROPERTY_NAME = '__slocSloConfig';

/**
 * Interface that every SLO must implement.
 *
 * @param C The type of the SloMapping CRD.
 * @param O The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 */
export interface ServiceLevelObjective<C extends KubernetesObjectWithSpec<SloMapping>, O> {

    /**
     * The SloMapping resource used to configure this SLO instance.
     */
    readonly config: C;

    /**
     * Configures this SLO using an SloMapping resource and a metrics source.
     * @param sloMapping The SloMapping that describes the configuration for this instance.
     */
    configure(sloMapping: C, metricsSource: MetricsSource): Promise<void>;

    /**
     * Evaluates the SLO on the current system state
     */
    evaluate(): Promise<O>;

}

export interface SloConfiguration {
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
