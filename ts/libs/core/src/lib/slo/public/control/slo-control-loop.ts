import { Observable } from 'rxjs';
import { IndexByKey } from '../../../util';
import { ServiceLevelObjective } from '../common';
import { SloEvaluator } from './slo-evaluator';

/**
 * Configuration needed for starting an `SloControlLoop`.
 */
export interface SloControlLoopConfig {

    /**
     * This observable defines the interval of the control loop.
     * Whenever it emits, a loop iteration is executed.
     */
    interval$: Observable<void>;

    /**
     * This is used to actually evaluate an SLO during an iteration
     * and apply its output to the orchestrator.
     *
     * It should be used to implement orchestrator-specific handling of the output.
     */
    evaluator: SloEvaluator;

}

/**
 * This interface must be implemented by classes that run an SLO control loop.
 */
export interface SloControlLoop {

    /**
     * `true` when the control loop is running, otherwise `false`.
     */
    isActive: boolean;

    /**
     * Adds the specified `slo` under the `key`, such that it will be evaluated on every loop iteration,
     * starting with the next one.
     *
     * If an SLO with the same `key` already exists, it will be replaced.
     *
     * @param key The key that should be used to identify the SLO.
     * @param slo The `ServiceLevelObjective` object.
     */
    addSlo(key: string, slo: ServiceLevelObjective<any, any>): void;

    /**
     * @returns The `ServiceLevelObjective` that has been added under the specified `key`
     * or `undefined` if no SLO exists for that key.
     */
    getSlo(key: string): ServiceLevelObjective<any, any>;

    /**
     * Removes the `ServiceLevelObjective` that has been added under the specified `key`
     * from future iterations of the control loop.
     */
    removeSlo(key: string): boolean;

    /**
     * @returns A map of all SLOs that are currently part of this control loop.
     */
    getAllSlos(): IndexByKey<ServiceLevelObjective<any, any>>;

    /**
     * Starts the control loop.
     *
     * @param config The `SloControlLoopConfig` used to configure the control loop.
     */
    start(config: SloControlLoopConfig): void;

    /**
     * Stops the control loop.
     */
    stop(): void;

}
