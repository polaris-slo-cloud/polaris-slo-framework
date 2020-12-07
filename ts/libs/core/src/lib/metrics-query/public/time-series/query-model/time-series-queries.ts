import { SlocQuery } from '../../generic';
import { TimeSeries, TimeSeriesInstant } from './time-series';
import { LabelFilter } from './time-series-filter';

/**
 * A query that rsults in `TimeSeries` and which provides operations that are
 * applicable to all `TimeSeries` queries.
 *
 * A `TimeSeriesQuery` realization is immutable to allow query objects to be reused
 * in multiple places.
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
 * A `TimeRangeQuery` realization is immutable to allow query objects to be reused
 * in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeInstantQuery`.
 */
export interface TimeRangeQuery<T> extends TimeSeriesQuery<TimeSeries<T>> {

    filterOnLabel(predicate: LabelFilter): TimeRangeQuery<T>;

    /**
     * Counts the number of times the value changes for each `TimeSeries` and returns that
     * count as a `TimeSeriesInstant`.
     *
     * @returns A `TimeInstantQuery`.
     */
    countChanges(): TimeInstantQuery<T>; // ToDo Check if this exists in MQL and Flux!

}

/**
 * A query that results in `TimeSeriesInstants`, i.e., each contains only a single sample.
 *
 * A `TimeInstantQuery` realization is immutable to allow query objects to be reused
 * in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeRangeQuery`.
 */
export interface TimeInstantQuery<T> extends TimeSeriesQuery<TimeSeriesInstant<T>> {

    filterOnLabel(predicate: LabelFilter): TimeInstantQuery<T>;

    /**
     * Converts the value of all `TimeSeries` to the absolute value.
     */
    abs(): TimeInstantQuery<T>;

}
