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
     * @param appName The name of the application, for which to get the metrics. In PromQL this is the beginning of the metric name,
     *  before the first underscore (e.g., 'myapp' for the metric 'myapp_response_time'), while in Flux this is the name of the bucket.
     * @param metricName The name of the metric that should be selected (i.e., the rest of the metric name in PromQL
     *  or the value of the `_measurement` column in Flux).
     * @returns A new `TimeInstantQuery`.
     */
    select<T = any>(appName: string, metricName: string): TimeInstantQuery<T>;

    /**
     * Creates a new `TimeRangeQuery` that selects all `TimeSeries` within the specified time range that have the specified `metricName`.
     *
     * @param appName The name of the application, for which to get the metrics. In PromQL this is the beginning of the metric name,
     *  before the first underscore (e.g., 'myapp' for the metric 'myapp_response_time'), while in Flux this is the name of the bucket.
     * @param metricName The name of the metric that should be selected (i.e., the rest of the metric name in PromQL
     *  or the value of the `_measurement` column in Flux).
     * @param range The `TimeRange` within which the selected samples of the `TimeSeries` should lie.
     * @returns A new `TimeRangeQuery`.
     */
    select<T = any>(appName: string, metricName: string, range: TimeRange): TimeRangeQuery<T>;

}
