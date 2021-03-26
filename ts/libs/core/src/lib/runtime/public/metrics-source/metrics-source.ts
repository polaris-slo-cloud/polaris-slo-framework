import { PolishedMetricParams, PolishedMetricSource, PolishedMetricType } from '../../../composed-metrics';
import { TimeSeriesSource } from '../../../raw-metrics-query/public/time-series';

/**
 * Encapsulates a source for obtaining metrics.
 */
export interface MetricsSource {

    /**
     * Gets the `TimeSeriesSource` with the specified `name` or the
     * default one, if no `name` is specified.
     *
     * @param name The fully qualified name of the `TimeSeriesSource`. If not specified, the default `TimeSeriesSource` is returned.
     * @returns The `TimeSeriesSource` with the specified `name` or `undefined` if the `name` is unknown.
     */
    getTimeSeriesSource(name?: string): TimeSeriesSource;

    /**
     * Gets a `PolishedMetricSource` for the specified `metricType` and `sloTarget`, optionally configured with `params`.
     *
     * This will return the default source for the `metricType`, unless `metricSourceName` is specified.
     *
     * @param metricType The type of polished metric that the source should supply.
     * @param params Parameters to configure the polished metric source.
     * @param metricSourceName (optional) The full name of the `PolishedMetricSource` that should be obtained
     */
    getPolishedMetricSource<V, P extends PolishedMetricParams>(
        metricType: PolishedMetricType<V, P>,
        params: P,
        metricSourceName?: string,
    ): PolishedMetricSource<V>;

}
