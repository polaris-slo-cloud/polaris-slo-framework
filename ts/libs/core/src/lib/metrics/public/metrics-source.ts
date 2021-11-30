import { ComposedMetricSource } from '../../composed-metrics';
import { ComposedMetricParams, ComposedMetricType } from '../../model';
import { TimeSeriesSource } from '../../raw-metrics-query';

/**
 * Encapsulates a source for obtaining metrics.
 */
export interface MetricsSource {

    /**
     * Gets the {@link TimeSeriesSource} with the specified `name` or the
     * default one, if no `name` is specified.
     *
     * @param name The fully qualified name of the `TimeSeriesSource`. If not specified, the default `TimeSeriesSource` is returned.
     * @returns The `TimeSeriesSource` with the specified `name` or `undefined` if the `name` is unknown.
     */
    getTimeSeriesSource(name?: string): TimeSeriesSource;

    /**
     * Gets a {@link ComposedMetricSource} for the specified `metricType` and `SloTarget` type (contained in `params`).
     *
     * @param metricType The type of composed metric that the source should supply.
     * @param params Parameters to configure the composed metric source.
     * @returns A new {@link ComposedMetricSource} for the {@link ComposedMetricType} and {@link SloTarget} type combination
     * or `undefined` if none is registered for this combination and also no fallback has been registered.
     */
    getComposedMetricSource<V, P extends ComposedMetricParams>(
        metricType: ComposedMetricType<V, P>,
        params: P,
    ): ComposedMetricSource<V>;

}
