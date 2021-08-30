import { PolarisRuntime } from '../../../runtime';
import { ComposedMetricParams } from './composed-metric-params';
import { ComposedMetricSource } from './composed-metric-source';
import { ComposedMetricType } from './composed-metric-type';

/**
 * A `ComposedMetricSourceFactory` is used to create a {@link ComposedMetricSource} instance that is scoped
 * to a particular `SloTarget`.
 *
 * A factory may support all `SloTarget` types or a specific set of `SloTarget` types - this needs to be documented
 * for each factory.
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
     * @param polarisRuntime The {@link PolarisRuntime} instance.
     * @returns A new {@link ComposedMetricSource}.
     */
    createSource(params: P, polarisRuntime: PolarisRuntime): ComposedMetricSource<V>;

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
     * @param polarisRuntime The {@link PolarisRuntime} instance.
     * @returns A new {@link ComposedMetricSource}.
     */
    createSource<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams>(
        metricType: M, params: P, polarisRuntime: PolarisRuntime
    ): ComposedMetricSource<V>;

}
