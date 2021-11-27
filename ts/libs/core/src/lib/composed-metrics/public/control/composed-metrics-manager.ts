import { ComposedMetricMapping, ComposedMetricParams, ObjectKind } from '../../../model';
import { WatchEventsHandler } from '../../../runtime';
import { ComposedMetricSourceFactory, ComposedMetricType } from '../../public/common';
import { ComposedMetricCollectorFactory } from './composed-metric-collector';

/** The default interval for composed metric calculations. */
export const COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS = 20 * 1000;

/**
 * Represents configuration for one a composed metric type that is calculated by a composed metric controller.
 *
 * @param M The {@link ComposedMetricType}, for which this factory creates sources.
 * @param V The TypeScript type that represents the values of the composed metric.
 * @param P Optional parameters that can be used to configure the {@link ComposedMetricSource}.
 */
export interface ComposedMetricComputationConfig<
    M extends ComposedMetricType<V, P> = ComposedMetricType<any, any>,
    V = any,
    P extends ComposedMetricParams = ComposedMetricParams
> {

    /** The {@link ComposedMetricType} that should be computed. */
    metricType: M;

    /** The {@link ObjectKind} of the `ComposedMetricMapping` that configures this composed metric. */
    mappingKind: ObjectKind;

    /** The {@link ComposedMetricSourceFactory} that creates a {@link ComposedMetricSource} when a new mapping instance is received. */
    metricSourceFactory: ComposedMetricSourceFactory<M, V, P>;

    /**
     * (optional) If set, limits the types of `SloTargets` that are supported by the {@link ComposedMetricSource}.
     * `ComposedMetricMappings` with an `SloTarget` that does not match any of these kinds are ignored.
     */
    supportedSloTargetKinds?: ObjectKind[];

}

/**
 * Configuration for an {@link ComposedMetricsManager}.
 */
export interface ComposedMetricsManagerConfig {

    /**
     * The `ComposedMetricMapping` kinds that should be watched and their respective metric types and factories.
     */
    kindsToWatch: ComposedMetricComputationConfig[];

    /**
     * The factories that will create the `ComposedMetricCollectors` for storing the computed metrics.
     */
    collectorFactories: ComposedMetricCollectorFactory[];

    /**
     * The length of the evaluation interval is milliseconds..
     *
     * If this is not specified, {@link COMPOSED_METRIC_COMPUTATION_DEFAULT_INTERVAL_MS} is used.
     */
    evaluationIntervalMs?: number;

}

/**
 * Concrete `WatchEventsHandler` subinterface for `ComposedMetricMappings`.
 */
 export interface ComposedMetricMappingWatchEventsHandler extends WatchEventsHandler<ComposedMetricMapping> {}

/**
 * Watches `ComposedMetricMappings` and regularly computes the composed metric for each of them to expose them to a collector.
 */
export interface ComposedMetricsManager {

    /**
     * `true` when the manager is currently watching `ComposedMetricMapping` kinds, otherwise `false`.
     */
    readonly isActive: boolean;

    /**
     * Starts the watches on the configured `ComposedMetricMapping` kinds.
     *
     * @param config The configuration that contains the `ComposedMetricMapping` kinds to watch and other parameters.
     */
    startWatching(config: ComposedMetricsManagerConfig): Promise<void>;

    /**
     * Stops the watches on the `ElasticityStrategyKinds`.
     */
    stopWatching(): void;

    /**
     * @returns The list of `ComposedMetricMapping` kinds and their configs.
     */
    getWatchedComposedMetricMappingKinds(): ComposedMetricComputationConfig<any, any>[];

}
