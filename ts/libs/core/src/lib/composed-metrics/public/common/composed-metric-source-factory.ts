import { SlocRuntime } from '../../../runtime';
import { ComposedMetricParams } from './composed-metric-params';
import { ComposedMetricSource } from './composed-metric-source';
import { ComposedMetricType } from './composed-metric-type';

/**
 * A `ComposedMetricSourceFactory` is used to create a `ComposedMetricSource` instance that is scoped
 * to a particular `SloTarget`.
 *
 * @param V The TypeScript type that represents the values of the composed metric.
 * @param P Optional parameters that can be used to configure the `ComposedMetricSource`.
 */
export interface ComposedMetricSourceFactory<M extends ComposedMetricType<V, P>, V = any, P extends ComposedMetricParams = ComposedMetricParams> {

    /**
     * The type of composed metric that the sources produced by this factory supply.
     */
    readonly metricType: M;

    /**
     * The full name of the `ComposedMetricSource` that this factory creates.
     */
    readonly metricSourceName: string;

    /**
     * Creates a new `ComposedMetricSource` for the specified `params`.
     *
     * @param params Parameters to configure the metric source.
     * @param slocRuntime The `SlocRuntime` instance.
     * @returns A new `ComposedMetricSource`.
     */
    createSource(params: P, slocRuntime: SlocRuntime): ComposedMetricSource<V>;

}
