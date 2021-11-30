import { MetricsSource } from '../../../metrics';
import { SloMapping, SloTarget } from '../../../model';
import { OrchestratorGateway } from '../../../orchestrator';
import { ObservableOrPromise } from '../../../util';
import { SloOutput } from './slo-output';

/**
 * This interface must be implemented by every SLO.
 *
 * @param C The type that describes the SLO's required configuration.
 * @param O The type of output data of the SLO, which must be supported by the target ElasticityStrategy.
 * @param T (optional) The type of `SloTarget` that the SLO can operate on.
 */
export interface ServiceLevelObjective<C, O, T extends SloTarget = SloTarget> {

    /**
     * The `SloMapping` that was used to configure this SLO instance.
     */
    readonly sloMapping: SloMapping<C, O, T>;

    /**
     * Configures this SLO using an `SloMappingSpec` and a metrics source.
     *
     * @param sloMapping The `SloMapping` that describes the configuration for this instance.
     * @param metricsSource The `MetricsSource` that should be used for querying the observed metrics.
     * @param orchestrator The `OrchestratorGateway` instance that allows creating orchestrator clients.
     * @returns An observable that emits and completes or a Promise that resolves when the SLO has finished its configuration.
     */
    configure(sloMapping: SloMapping<C, O, T>, metricsSource: MetricsSource, orchestrator: OrchestratorGateway): ObservableOrPromise<void>;

    /**
     * Evaluates the SLO on the current system state.
     *
     * @returns An observable or a Promise that emits or resolves to
     * - the output that should be used for configuring the elasticity strategy or
     * - `null`, if no action should be taken (i.e., elasticity strategy requires no change).
     */
    evaluate(): ObservableOrPromise<SloOutput<O> | null>;

    /**
     * This method is called by the control loop when this SLO is about to be destroyed.
     *
     * Its implementation is optional and it can be used to for cleanup.
     */
    onDestroy?(): void;

}
