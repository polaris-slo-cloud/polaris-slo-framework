import { PolishedMetricParams } from './polished-metric-params';
import { PolishedMetricSource } from './polished-metric-source';
import { PolishedMetricType } from './polished-metric-type';

/**
 * A `PolishedMetricSourceFactory` is used to create a `PolishedMetricSource` instance that is scoped
 * to a particular `SloTarget`.
 *
 * @param V The TypeScript type that represents the values of the polished metric.
 * @param P Optional parameters that can be used to configure the `PolishedMetricSource`.
 */
export interface PolishedMetricSourceFactory<M extends PolishedMetricType<V, P>, V = any, P extends PolishedMetricParams = PolishedMetricParams> {

    /**
     * The type of polished metric that the sources produced by this factory supply.
     */
    readonly metricType: M;

    /**
     * The full name of the `PolishedMetricSource` that this factory creates.
     */
    readonly metricSourceName: string;

    /**
     * Creates a new `PolishedMetricSource` for the specified `params`.
     *
     * @param params Parameters to configure the metric source.
     * @returns A new `PolishedMetricSource`.
     */
    createSource(params: P): PolishedMetricSource<V>;

}
