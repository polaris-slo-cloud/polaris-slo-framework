import { ElasticityStrategyKind, SloTarget } from '../../../model';
import { ElasticityStrategyController } from '../common';

/** The default timeout period for elasticity strategy executions. */
export const ELASTICITY_STRATEGY_DEFAULT_TIMEOUT_MS = 60 * 1000;

/**
 * Maps an `ElasticityStrategyKind` to the `ElasticityStrategyController` that is responsible for it.
 */
export interface ElasticityStrategyKindControllerPair<O = any, T extends SloTarget = SloTarget, C = Record<string, any>> {

    /** The type of elasticity strategy. */
    kind: ElasticityStrategyKind<O, T, C>;

    /** The controller that is responsible for handling elasticity strategies of type `kind`. */
    controller: ElasticityStrategyController<O, T, C>

}

/**
 * Configuration options for an `ElasticityStrategyManager`.
 */
export interface ElasticityStrategyManagerConfig {

    /**
     * The `ElasticityStrategyKinds` that should be watched by this manager - each
     * `ElasticityStrategyKind` needs to be associated with an `ElasticityStrategyController`
     * that will handle the execution of the elasticity strategies.
     */
    kindsToWatch: ElasticityStrategyKindControllerPair[];

    /**
     * The number of milliseconds after which an elasticity strategy execution should time out.
     *
     * If this is not specified, `ELASTICITY_STRATEGY_DEFAULT_TIMEOUT_MS` is used.
     */
    timeoutMs?: number;

}

/**
 * Watches elasticity strategies of the configured kinds and executes them if necessary.
 */
export interface ElasticityStrategyManager {

    /**
     * `true` when the manager is currently watching `ElasticityStrategyKinds`, otherwise `false`.
     */
     readonly isActive: boolean;

    /**
     * Starts the watches on the configured `ElasticityStrategyKinds`.
     *
     * @param config The configuration that contains the `ElasticityStrategyKinds` and other parameters.
     */
    startWatching(config: ElasticityStrategyManagerConfig): Promise<void>;

    /**
     * Stops the watches on the `ElasticityStrategyKinds`.
     */
    stopWatching(): void;

    /**
     * @returns The list of `ElasticityStrategyKinds` and their associated `ElasticityStrategyController` instances.
     */
    getWatchedElasticityStrategyKinds(): ElasticityStrategyKindControllerPair[];

}
