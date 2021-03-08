import { SloTarget } from '../../../model';
import { PolishedMetricParams, PolishedMetricSource } from '../../../polished-metrics';
import { PolishedMetricType } from '../../../polished-metrics/public/common/polished-metric-type';
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
     * This will return the default source for the `metricType`, unless the `params` indicate a specific `metricSourceName`.
     *
     * @param metricType The type of polished metric that the source should supply.
     * @param sloTarget The target workload, from which the metric should be obtained.
     * @param params (optional) Parameters to configure the polished metric source.
     */
    getPolishedMetricSource<
        M extends PolishedMetricType<V, T, P>,
        V,
        T extends SloTarget,
        P extends PolishedMetricParams,
    >(metricType: M, sloTarget: T, params?: P): PolishedMetricSource<V>;

}
