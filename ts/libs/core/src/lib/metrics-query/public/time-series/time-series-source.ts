import { TimeRange } from './time-range';
import { TimeInstantQuery, TimeRangeQuery } from './time-series-queries';

/**
 * Encapsulates a source for `TimeSeries` - allows creating new `TimeSeriesQueries`.
 */
export interface TimeSeriesSource {

    /**
     * Creates a new `TimeInstantQuery` that selects all `TimeSeries` that have the specified `metricName`.
     *
     * The `TimeSeries` resulting from this query will have a single sample each.
     *
     * @param metricName The name of the metric that should be selected.
     * @returns A new `TimeInstantQuery`.
     */
    select<T = any>(metricName: string): TimeInstantQuery<T>;

    /**
     * Creates a new `TimeRangeQuery` that selects all `TimeSeries` within the specified time range that have the specified `metricName`.
     *
     * @param metricName The name of the metric that should be selected.
     * @param range The `TimeRange` within which the selected samples of the `TimeSeries` should lie.
     * @returns A new `TimeRangeQuery`.
     */
    select<T = any>(metricName: string, range: TimeRange): TimeRangeQuery<T>;

}
