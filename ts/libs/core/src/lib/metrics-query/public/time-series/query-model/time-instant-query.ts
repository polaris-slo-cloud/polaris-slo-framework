import { TimeSeriesInstant } from './time-series';
import { LabelFilterableQuery, ValueFilterableQuery } from './time-series-query';

// Important: If we ever add a method that returns a TimeRangeQuery, we need to use a similar approach to
// the one used for `TimeInstantQueryBase`, `TimeInstantQueryImpl`, `TimeRangeQueryBase`, and `TimeRangeQueryImpl` to avoid
// circular dependencies between .ts files.

/**
 * A query, whose execution results in one or more `TimeSeriesInstants`, i.e., each contains only a single sample.
 *
 * A `TimeInstantQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 */
export interface TimeInstantQuery<T> extends ValueFilterableQuery<TimeSeriesInstant<T>, TimeInstantQuery<T>> {

    /**
     * Converts the value of all `TimeSeries` to the absolute value.
     */
    abs(): TimeInstantQuery<T>;

    /**
     * Adds the resulting values of another `TimeInstantQuery` to this one.
     *
     * @note The results of both queries must match.
     *
     * @param addend The query, whose results should be added.
     */
    add(addend: TimeInstantQuery<T>): TimeInstantQuery<T>;

}

/**
 * A `TimeInstantQuery` that allows filtering on labels.
 *
 * The use of one of any method other than `filterOnLabel()`, will usually
 * result in the loss of the label-filterable functionality for the rest of the query, because
 * some DBs only support label filtering on the stored data, but not on computed data.
 *
 * A `LabelFilterableTimeInstantQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 */
export interface LabelFilterableTimeInstantQuery<T> extends
    TimeInstantQuery<T>,
    LabelFilterableQuery<TimeSeriesInstant<T>, LabelFilterableTimeInstantQuery<T>> { }
