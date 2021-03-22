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
     * Adds a constant value or the resulting values of another `TimeInstantQuery` to this one.
     *
     * @note The results of both queries must match.
     *
     * @param addend The constant or the query, whose results should be added.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    add(addend: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Subtracts a constant value or the resulting values of another `TimeInstantQuery` from this one.
     *
     * @note The results of both queries must match.
     *
     * @param subtrahend The constant or the query, whose results should be subtracted.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    subtract(subtrahend: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Multiplies the results of this query by a constant value or the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param factor The constant or the query, by whose results this query's results should be multiplied.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    multiplyBy(factor: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Divides the results of this query by a constant value or the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param divisor The constant or the query, by whose results this query's results should be divided.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    divideBy(divisor: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Calculates the modulus of the results of this query divided by a constant value or the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param divisor The constant or the query, by whose results this query's results should be divided to determine the modulus.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    modulo(divisor: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Raises the results of this query by a constant value or the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param exponent The constant or the query, by whose results this query's results should be raised.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     */
    pow(exponent: T | TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Returns a query with the union of the results of this query and the `other` query.
     *
     * @param other The query, whose results should be united with this query's results.
     * The query must have been created by the same `TimeSeriesSource` as this one.
     */
    union(other: TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Returns a query with the intersection of the results of this query and the `other` query.
     *
     * @param other The query, whose results should be intersected with this query's results.
     * The query must have been created by the same `TimeSeriesSource` as this one.
     */
    intersect(other: TimeInstantQuery<T>): TimeInstantQuery<T>

    /**
     * Returns a query with the relative complement of the results of the `other` query in the results of this query.
     *
     * If `a` and `b` are sets, the relative complement of `b` in `a` (`a \ b`) is coded as:
     * ```
     * a.complementOf(b);
     * ```
     *
     * @param other The query that results in the set `b`.
     * The query must have been created by the same `TimeSeriesSource` as this one.
     */
    complementOf(other: TimeInstantQuery<T>): TimeInstantQuery<T>;

    /**
     * Groups the `TimeSeries` by the specified labels and then computes the
     * sum within each group.
     *
     * @param groupingLabels The label by which to group the `TimeSeries`
     * @returns A `TimeInstantQuery` with one `TimeSeriesInstant` per group.
     */
    sumByGroup(...groupingLabels: string[]): TimeInstantQuery<number>;

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
