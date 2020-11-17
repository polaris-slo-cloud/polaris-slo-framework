/**
 * This interface must be implemented by every controller that is responsible for an `ElasticityStrategy`.
 *
 * @note An `ElasticityStrategyController` is responsible for handling all instances of the `ElasticityStrategy`
 * it is responsible for.
 * This is unlike a `ServiceLevelObjective` or a `MetricSensor`, where each `SloMapping` or `MetricMapping` is handled
 * by a distinct instance of `ServiceLevelObjective` or a `MetricSensor`.
 *
 * @param T The type of output parameters from the SLO/input parameters of the elasticity strategy.
 */
export interface ElasticityStrategyController<T> {

    // ToDo

}
