import { MetricsSource } from '../../../metrics';
import { SloMappingSpec } from '../../../model';
import { SlocRuntime } from '../../../runtime';
import { SloOutput } from './slo-output';

/**
 * This interface must be implemented by every SLO.
 *
 * @param S The type of the `SloMappingSpec`.
 * @param E The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 */
export interface ServiceLevelObjective<S extends SloMappingSpec, E> {

    /**
     * The SloMappingSpec that was used to configure this SLO instance.
     */
    readonly spec: S;

    /**
     * Configures this SLO using an `SloMappingSpec` and a metrics source.
     *
     * @param spec The `SloMappingSpec` that describes the configuration for this instance.
     * @param metricsSource The `MetricsSource` that should be used for querying the observed metrics.
     * @param slocRuntime The `SlocRuntime` instance.
     * @returns A Promise that resolves when the SLO has finished its configuration.
     */
    configure(spec: S, metricsSource: MetricsSource, slocRuntime: SlocRuntime): Promise<void>;

    /**
     * Evaluates the SLO on the current system state.
     *
     * @returns A Promise that resolves to
     * - the output that should be used for configuring the elasticity strategy or
     * - `null`, if no action should be taken (i.e., elasticity strategy requires no change).
     */
    evaluate(): Promise<SloOutput<E> | null>;

    /**
     * This method is called by the control loop when this SLO is about to be destroyed.
     *
     * Its implementation is optional and it can be used to for cleanup.
     */
    onDestroy?(): void;

}
