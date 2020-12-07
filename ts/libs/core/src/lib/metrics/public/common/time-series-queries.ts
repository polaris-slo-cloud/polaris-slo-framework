import { SlocQuery } from './sloc-query';
import { TimeRange } from './time-range';
import { TimeSeries, TimeSeriesInstant } from './time-series';
import { LabelFilter } from './time-series-filter';

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

/**
 * A query that rsults in `TimeSeries` and which provides operations that are
 * applicable to all `TimeSeries` queries.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 */
export interface TimeSeriesQuery<T extends TimeSeries<any>> extends SlocQuery<T> {

    /**
     * Filters the input `TimeSeries`, based on their labels using the provided `predicate`, i.e., only
     * `TimeSeries` that fulfill the `predicate` constitute the output of the filter operation.
     *
     * Chaining multiple `filterOnLabel()` calls will result in a combination of these filters using
     * the `AND` operator, i.e., all the predicates must be fulfilled.
     *
     * @param predicate The label predicate that all output `TimeSeries` must fulfill.
     * @returns A new `TimeSeriesQuery`, whose results are all the input `TimeSeries` that fulfill the `predicate`.
     */
    // If necessary, we can introduce other combinations later on by allowing the predicate to contain
    // a complex filter (e.g., predicates combined with OR).
    filterOnLabel(predicate: LabelFilter): TimeSeriesQuery<T>;

    // ToDo:
    // /**
    //  * Filters the input `TimeSeries`, based on their values using the provided `predicate`, i.e., only
    //  * `TimeSeries` that fulfill the `predicate` constitute the output of the filter operation.
    //  *
    //  * Chaining multiple `filterOnLabel()` calls will result in a combination of these filters using
    //  * the `AND` operator, i.e., all the predicates must be fulfilled.
    //  *
    //  * @param predicate The value predicate that all output `TimeSeries` must fulfill.
    //  * @returns A new `TimeSeriesQuery`, whose results are all the input `TimeSeries` that fulfill the `predicate`.
    //  */
    // filterOnValue(predicate: TimeSeriesFilter): TimeSeriesQuery<T>;

}


/**
 * A query that results in `TimeSeries` that cover a range of time, i.e., they normally contain
 * multiple samples.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeInstantQuery`.
 */
export interface TimeRangeQuery<T> extends TimeSeriesQuery<TimeSeries<T>> {

    filterOnLabel(predicate: LabelFilter): TimeRangeQuery<T>;

}

/**
 * A query that results in `TimeSeriesInstants`, i.e., each contains only a single sample.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeRangeQuery`.
 */
export interface TimeInstantQuery<T> extends TimeSeriesQuery<TimeSeriesInstant<T>> {

    filterOnLabel(predicate: LabelFilter): TimeInstantQuery<T>;

}
