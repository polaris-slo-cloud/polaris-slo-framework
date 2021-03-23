import { JoinConfig } from './join-config';
import { LabelGroupingConfig } from './label-grouping-config';
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
     * Adds a constant value to resulting values of this query.
     *
     * @param addend The constant that should be added.
     */
    add(addend: T): TimeInstantQuery<T>;

    /**
     * Adds the resulting values of another `TimeInstantQuery` to this one.
     *
     * @note The results of both queries must match.
     *
     * @param addend The query, whose results should be added.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    add(addend: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

    /**
     * Subtracts a constant value from the resulting values of this query.
     *
     * @param subtrahend The constant that should be subtracted.
     */
    subtract(subtrahend: T): TimeInstantQuery<T>;

    /**
     * Subtracts the resulting values of another `TimeInstantQuery` from this one.
     *
     * @note The results of both queries must match.
     *
     * @param subtrahend The query, whose results should be subtracted.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    subtract(subtrahend: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

    /**
     * Multiplies the results of this query by a constant value.
     *
     * @param factor The constant with which the results of this query should be multiplied.
     */
    multiplyBy(factor: T): TimeInstantQuery<T>;

    /**
     * Multiplies the results of this query by the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param factor The query, by whose results this query's results should be multiplied.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    multiplyBy(factor: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

    /**
     * Divides the results of this query by a constant value.
     *
     * @param divisor The constant by which this query's results should be divided.
     */
    divideBy(divisor: T): TimeInstantQuery<T>;

    /**
     * Divides the results of this query by the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param divisor The query, by whose results this query's results should be divided.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    divideBy(divisor: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

    /**
     * Calculates the modulus of the results of this query divided by a constant value.
     *
     * @param divisor The constant by which this query's results should be divided to determine the modulus.
     */
    modulo(divisor: T): TimeInstantQuery<T>;

    /**
     * Calculates the modulus of the results of this query divided by the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param divisor The query, by whose results this query's results should be divided to determine the modulus.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    modulo(divisor: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

    /**
     * Raises the results of this query by a constant value.
     *
     * @param exponent The constant by which this query's results should be raised.
     */
     pow(exponent: T): TimeInstantQuery<T>;

    /**
     * Raises the results of this query by the resulting values of another `TimeInstantQuery`.
     *
     * @note The results of both queries must match.
     *
     * @param exponent The query, by whose results this query's results should be raised.
     * If this is a query, it must have been created by the same `TimeSeriesSource` as this one.
     * @param joinConfig (optional) Additional options for configuring the join with the second query.
     */
    pow(exponent: TimeInstantQuery<T>, joinConfig?: JoinConfig): TimeInstantQuery<T>;

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
     * Groups the `TimeSeries` using the specified `LabelGroupingConfig` and then computes the
     * sum within each group.
     *
     * @param groupingConfig The configuration used for grouping. Use the static methods of the `LabelGrouping` class
     * to create this parameter. If no config is specified, grouping is performed by the set of all labels.
     * @returns A `TimeInstantQuery` with one `TimeSeriesInstant` per group.
     */
    sumByGroup(groupingConfig?: LabelGroupingConfig): TimeInstantQuery<number>;

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
