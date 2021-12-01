import { MetricsSource } from '../../../metrics/public/metrics-source';
import { ComposedMetricParams, ComposedMetricType } from '../../../model';
import { OrchestratorGateway } from '../../../orchestrator';
import { ComposedMetricSource } from './composed-metric-source';

// We import MetricsSource from its .ts file directly, instead through the metrics/index.ts file
// to avoid a circular dependency that would be created by this import in combination with an import by MetricsSource.
// Unfortunately, I could not find a better way to avoid this at the moment.

/**
 * A `ComposedMetricSourceFactory` is used to create a {@link ComposedMetricSource} instance that is scoped
 * to a particular `SloTarget`.
 *
 * A factory may support all `SloTarget` types or a specific set of `SloTarget` types - this needs to be documented
 * for each factory, e.g., in a static property that contains the list of `SloTarget` types.
 * Such a list can be used to register an instance of the factory for each supported `SloTarget` type with the
 * `MetricsSourcesManager`. This registration must be done if the metric source should execute in the current process,
 * i.e., metric source instances can be requested through `MetricSource.getComposedMetricSource()`.
 *
 * When creating a composed metric controller, the list of compatible `SloTarget` types is determined by
 * the `ComposedMetricMapping` type.
 *
 * @param M The {@link ComposedMetricType}, for which this factory creates sources.
 * @param V The TypeScript type that represents the values of the composed metric.
 * @param P Optional parameters that can be used to configure the {@link ComposedMetricSource}.
 */
export interface ComposedMetricSourceFactory<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams> {

    /**
     * The type of composed metric that the sources produced by this factory supply.
     */
    readonly metricType: M;

    /**
     * The full name of the {@link ComposedMetricSource} that this factory creates.
     */
    readonly metricSourceName: string;

    /**
     * Creates a new {@link ComposedMetricSource} for the specified `params`.
     *
     * @param params Parameters to configure the metric source.
     * @param metricsSource The `MetricsSource` that can be used for querying lower level metrics.
     * @param orchestrator The `OrchestratorGateway` instance that allows creating orchestrator clients.
     * @returns A new {@link ComposedMetricSource}.
     */
    createSource(params: P, metricsSource: MetricsSource, orchestrator: OrchestratorGateway): ComposedMetricSource<V>;

}

/**
 * A `GenericComposedMetricSourceFactory`is used to create a {@link ComposedMetricSource} instance for a generic composed metric type,
 * scoped to a particular `SloTarget`.
 *
 * The difference between this factory type to a {@link ComposedMetricSourceFactory} is that a `ComposedMetricSourceFactory` creates
 * sources for one specific {@link ComposedMetricType}, while `GenericComposedMetricSourceFactory` creates sources for
 * any {@link ComposedMetricType} and used as a fallback when no specific factory is registered for a composed metric type.
 */
export interface GenericComposedMetricSourceFactory {

    /**
     * The full name of the {@link ComposedMetricSource} that this factory creates.
     */
    readonly metricSourceName: string;

    /**
     * Creates a new {@link ComposedMetricSource} for the specified `params`.
     *
     * @param metricType The {@link ComposedMetricType} that should be supplied by the created source.
     * @param params Parameters to configure the metric source.
     * @param metricsSource The `MetricsSource` that can be used for querying lower level metrics.
     * @param orchestrator The `OrchestratorGateway` instance that allows creating orchestrator clients.
     * @returns A new {@link ComposedMetricSource}.
     */
    createSource<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams>(
        metricType: M, params: P, metricsSource: MetricsSource, orchestrator: OrchestratorGateway
    ): ComposedMetricSource<V>;

}
