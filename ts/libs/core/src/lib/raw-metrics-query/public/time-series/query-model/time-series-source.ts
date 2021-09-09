import { LabelFilterableTimeInstantQuery } from './time-instant-query';
import { TimeRange } from './time-range';
import { LabelFilterableTimeRangeQuery } from './time-range-query';

/**
 * Encapsulates a source for `TimeSeries` - allows creating new `TimeSeriesQueries`.
 */
export interface TimeSeriesSource {

    /** The fully qualified name of this `TimeSeriesSource`. */
    readonly fullName: string;

    /**
     * Creates a new `TimeInstantQuery` that selects all `TimeSeries` that have the specified `metricName`.
     *
     * The `TimeSeries` resulting from this query will have a single sample each.
     *
     * @param appName The name of the application, for which to get the metrics. In PromQL this is the beginning of the metric name,
     *  before the first underscore (e.g., 'myapp' for the metric 'myapp_response_time'), while in Flux this is the name of the bucket.
     * @param metricName The name of the metric that should be selected (i.e., the rest of the metric name in PromQL
     *  or the value of the `_measurement` column in Flux).
     * @returns A new `TimeInstantQuery` that allows filtering on labels.
     */
    select<T = any>(appName: string, metricName: string): LabelFilterableTimeInstantQuery<T>;

    /**
     * Creates a new `TimeRangeQuery` that selects all `TimeSeries` within the specified time range that have the specified `metricName`.
     *
     * @param appName The name of the application, for which to get the metrics. In PromQL this is the beginning of the metric name,
     *  before the first underscore (e.g., 'myapp' for the metric 'myapp_response_time'), while in Flux this is the name of the bucket.
     * @param metricName The name of the metric that should be selected (i.e., the rest of the metric name in PromQL
     *  or the value of the `_measurement` column in Flux).
     * @param range The `TimeRange` within which the selected samples of the `TimeSeries` should lie.
     * @returns A new `TimeRangeQuery` that allows filtering on labels.
     */
    select<T = any>(appName: string, metricName: string, range: TimeRange): LabelFilterableTimeRangeQuery<T>;

}
