import { ElasticityStrategy } from '../../../model';

/**
 * Provides a timestamped record of the execution of an elasticity strategy.
 *
 * @param E The type of `ElasticityStrategy` that is tracked.
 * @param O The type of operation or description of the operation that is executed for an elasticity strategy.
 */
export interface ElasticityStrategyExecution<E extends ElasticityStrategy<any>, O> {

    /** The time when this execution finished successfully. */
    timestamp: Date;

    /** The `ElasticityStrategy` instance that caused this execution. */
    elasticityStrategy: E;

    /** The operation or description of the operation that was executed. */
    operation: O;

}

/**
 * Allows tracking the last execution of an elasticity strategy for each target.
 *
 * @param E The type of `ElasticityStrategy` that is tracked.
 * @param O The type of operation or description of the operation that is executed for an elasticity strategy.
 */
export interface ElasticityStrategyExecutionTracker<E extends ElasticityStrategy<any>, O> {

    /**
     * Gets the number of `ElasticityStrategies`, for which executions are currently on record.
     */
    readonly trackedElasticityStrategiesCount: number;

    /**
     * Gets the last recorded `ElasticityStrategyExecution` for the specified `target`.
     *
     * @param elasticityStrategy The `SloTarget`, for which the execution should be retrieved.
     * @returns The last recorded `ElasticityStrategyExecution` for the specified `elasticityStrategy` (or any of its previous instances) or `undefined`,
     * if no such record exists (i.e., the elasticity strategy has never executed during the lifetime of the controller
     * or the last execution record has expired).
     */
    getLastExecution(elasticityStrategy: E): ElasticityStrategyExecution<E, O>;

    /**
     * Adds an `ElasticityStrategyExecution` record for the specified `elasticityStrategy`.
     *
     * The timestamp of the record is taken during the execution of this method.
     *
     * @param elasticityStrategy The `ElasticityStrategy` instance, for which an execution should be recorded.
     * @param operation the operation or description of the operation that was executed.
     * @returns The new `ElasticityStrategyExecution` record.
     */
    addExecution(elasticityStrategy: E, operation: O): ElasticityStrategyExecution<E, O>;

    /**
     * Removes the specified `elasticityStrategy` and its record from this tracker.
     *
     * If the specified `elasticityStrategy` is currently not tracked, this request is ignored.
     *
     * @param elasticityStrategy The `ElasticityStrategy`, for which the tracked record should be removed.
     */
    removeElasticityStrategy(elasticityStrategy: E): void;

    /**
     * Removes all `ElasticityStrategyExecutions` that are older than their maximum `StabilizationWindow` time.
     */
    evictExpiredExecutions(): void;

}
