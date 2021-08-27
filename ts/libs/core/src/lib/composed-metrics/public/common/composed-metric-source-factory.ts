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
