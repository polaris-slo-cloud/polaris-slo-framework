import { TimeInstantQuery } from './time-instant-query';
import { TimeSeries } from './time-series';
import { LabelFilterableQuery, ValueFilterableQuery } from './time-series-query';

/**
 * A query, whose exection results in one or more `TimeSeries` that cover a range of time,
 * i.e., they normally contain multiple samples.
 *
 * A `TimeRangeQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeInstantQuery`.
 */
export interface TimeRangeQuery<T> extends ValueFilterableQuery<TimeSeries<T>, TimeRangeQuery<T>> {

    /**
     * Counts the number of times the value changes for each `TimeSeries` and returns that
     * count as a `TimeSeriesInstant`.
     *
     * @returns A `TimeInstantQuery`.
     */
    countChanges(): TimeInstantQuery<T>; // ToDo Check if this exists in MQL and Flux!

    /**
     * Groups the `TimeSeries` by the specified labels and then computes the
     * sum within each group.
     *
     * @param groupingLabels The label by which to group the `TimeSeries`
     * @returns A `TimeInstantQuery` with one `TimeSeriesInstant` per group.
     */
    sumByGroup(...groupingLabels: string[]): TimeInstantQuery<number>;

    /**
     * Computes the per-second average rate of increase of the values of the `TimeSeries`.
     */
    rate(): TimeRangeQuery<number>;

    /**
     * Changes the resolution of this `TimeRangeQuery`.
     *
     * @param resolutionSec The new resolution in seconds.
     */
    changeResolution(resolutionSec: number): TimeRangeQuery<T>;

}

/**
 * A `TimeRangeQuery` that allows filtering on labels.
 *
 * The use of one of any method other than `filterOnLabel()`, will usually
 * result in the loss of the label-filterable functionality for the rest of the query, because
 * some DBs only support label filtering on the stored data, but not on computed data.
 *
 * A `LabelFilterableTimeRangeQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 */
export interface LabelFilterableTimeRangeQuery<T> extends
    TimeRangeQuery<T>,
    LabelFilterableQuery<TimeSeries<T>, LabelFilterableTimeRangeQuery<T>> { }
