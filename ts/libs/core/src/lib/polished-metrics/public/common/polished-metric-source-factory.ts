import { SloTarget } from '../../../model';
import { PolishedMetricSource } from './polished-metric-source';

/**
 * A `PolishedMetricSourceFactory` is used to create a `PolishedMetricSource` instance that is scoped
 * to a particular `SloTarget`.
 *
 * @param V The TypeScript type that represents the values of the polished metric.
 * @param T The type of `SloTarget` that the polished metric can be obtained from.
 * @param P Optional parameters that can be used to configure the `PolishedMetricSource`.
 */
export interface PolishedMetricSourceFactory<V, T extends SloTarget = SloTarget, P = never> {

    /**
     * Creates a new `PolishedMetricSource` for the specified `sloTarget` and the optional `params`.
     *
     * @param sloTarget The target workload, where the metric should be obtained from.
     * @param params (optional) Parameters to further configure the metric source.
     * @returns A new `PolishedMetricSource`.
     */
    createSource(sloTarget: T, params?: P): PolishedMetricSource<V>;

}
