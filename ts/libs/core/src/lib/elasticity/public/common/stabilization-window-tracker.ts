import { ElasticityStrategy } from '../../../model';

/**
 * Facilitates tracking of the stabilization windows for a set of elasticity strategies.
 *
 * The same functionality can be achieved with `ElasticityStrategyExecutionTracker` and additional code.
 * The use of `StabilizationWindowTracker` is recommended, if it is not necessary to record details about
 * the last applied operation.
 * Otherwise, if further details should be recorded (e.g., number of replicas),
 * `ElasticityStrategyExecutionTracker` should be used.
 *
 * Note that, for simplicity, the term `scale up` is used for any operation that increases resources
 * and the term `scale down` is used for any operation that decreases resources.
 *
 * @param E The type of `ElasticityStrategy` for which to track the stabilization windows.
 */
export interface StabilizationWindowTracker<E extends ElasticityStrategy<any>> {

    /**
     * Tracks an execution of the specified `elasticityStrategy` instance.
     *
     * @param elasticityStrategy The `ElasticityStrategy` instance, for which the execution should be recorded.
     */
    trackExecution(elasticityStrategy: E): void;

    /**
     * Checks if the scale up stabilization window for the specified `elasticityStrategy` instance has already passed.
     *
     * @param elasticityStrategy The `ElasticityStrategy` instance, for which the stabilization window should be checked.
     * @returns `true`, if the stabilization window for scaling up has passed for the `elasticityStrategy` instance or if
     * there is no tracking data for this instance, otherwise `false`.
     */
    isOutsideStabilizationWindowForScaleUp(elasticityStrategy: E): boolean;

    /**
     * Checks if the scale down stabilization window for the specified `elasticityStrategy` instance has already passed.
     *
     * @param elasticityStrategy The `ElasticityStrategy` instance, for which the stabilization window should be checked.
     * @returns `true`, if the stabilization window for scaling down has passed for the `elasticityStrategy` instance or if
     * there is no tracking data for this instance, otherwise `false`.
     */
    isOutsideStabilizationWindowForScaleDown(elasticityStrategy: E): boolean;

    /**
     * Removes the specified `elasticityStrategy` and its record from this tracker.
     *
     * If the specified `elasticityStrategy` is currently not tracked, this request is ignored.
     *
     * @param elasticityStrategy The `ElasticityStrategy`, for which the tracked record should be removed.
     */
    removeElasticityStrategy(elasticityStrategy: E): void;

    /**
     * Removes all tracking data that are older than their maximum `StabilizationWindow` time.
     */
    evictExpiredExecutions(): void;

}
