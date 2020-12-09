import { SlocQuery } from '../../generic';
import { LabelFilter } from './label-filter';
import { TimeSeries, TimeSeriesInstant } from './time-series';
import { ValueFilter } from './value-filter';

/**
 * A query that results in `TimeSeries` and which provides operations that are
 * applicable to all `TimeSeries` queries.
 *
 * There are two main types of TimeSeriesQueries:
 * - `TimeRangeQuery`, whose execution results in an array of `TimeSeries`, each normally containing multiple samples.
 * - `TimeInstantQuery`, whose execution results in an array of `TimeSeriesInstant` objects, each containing a single sample.
 *
 * Both main query types allow applying filters on the values of the `TimeSeries`.
 *
 * The main query types may be combined with `LabelFilterableQuery`, which allows filtering on labels.
 * A query resulting from a `TimeSeriesSource.select()` will be either
 * - a `LabelFilterableTimeRangeQuery = TimeRangeQuery & LabelFilterableQuery`, if a `TimeRange` was specified, or
 * - a `LabelFilterableTimeInstantQueryQuery = TimeInstantQuery & LabelFilterableQuery`, if no `TimeRange` was specified.
 *
 * The use of one of any method other than `filterOnLabel()`, will usually
 * result in the loss of the label-filterable functionality for the rest of the query, because
 * some DBs only support label filtering on the stored data, but not on computed data.
 *
 * A `TimeSeriesQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The type of `TimeSeries` that is returned by this query.
 */
export interface TimeSeriesQuery<T extends TimeSeries<any>> extends SlocQuery<T> { }


/**
 * A `TimeSeriesQuery` that allows filtering on the values.
 *
 * A `TimeSeriesQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The type of `TimeSeries` that is returned by this query.
 * @param Q Used to capture the type of `this` for every interface realization, because the filter() method must return
 * a new instance of the realizing class and TypeScript's polymorphic `this` return type does not allow capturing this so far
 * (see https://github.com/Microsoft/TypeScript/issues/283#issuecomment-194034654).
 *
 * @note An alternative to the `Q` class parameter would have been a generic parameter on every method:
 * `filterOnValue<Q extends this>(predicate: ValueFilter): Q;`
 * But this would have allowed the user to (incorrectly) change the typing of the return value of a method:
 * `query.filterOnValue<SomeOtherQueryType>()`.
 */
export interface ValueFilterableQuery<T extends TimeSeries<any>, Q extends ValueFilterableQuery<T, any>> extends TimeSeriesQuery<T> {

    /**
     * Filters the input `TimeSeries`, based on their values using the provided `predicate`, i.e., only
     * `TimeSeries` that fulfill the `predicate` constitute the output of the filter operation.
     *
     * Chaining multiple `filterOnLabel()` calls will result in a combination of these filters using
     * the `AND` operator, i.e., all the predicates must be fulfilled.
     *
     * @param predicate The value predicate that all output `TimeSeries` must fulfill.
     * @returns A new `TimeSeriesQuery`, whose results are all the input `TimeSeries` that fulfill the `predicate`.
     */
    filterOnValue(predicate: ValueFilter): Q;

}


/**
 * A `TimeSeriesQuery` that allows filtering on the labels.
 *
 * A `TimeSeriesQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The type of `TimeSeries` that is returned by this query.
 * @param Q Used to capture the type of `this` for every interface realization, because the filter() method must return
 * a new instance of the realizing class and TypeScript's polymorphic `this` return type does not allow capturing this so far
 * (see https://github.com/Microsoft/TypeScript/issues/283#issuecomment-194034654).
 *
 * @note An alternative to the `Q` class parameter would have been a generic parameter on every method:
 * `filterOnLabel<Q extends this>(predicate: LabelFilter): Q;`
 * But this would have allowed the user to (incorrectly) change the typing of the return value of a method:
 * `query.filterOnLabel<SomeOtherQueryType>()`.
 */
export interface LabelFilterableQuery<T extends TimeSeries<any>, Q extends LabelFilterableQuery<T, any>> extends TimeSeriesQuery<T> {

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
    filterOnLabel(predicate: LabelFilter): Q;

}


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

}


/**
 * A query, whose execution results in one or more `TimeSeriesInstants`, i.e., each contains only a single sample.
 *
 * A `TimeInstantQuery` realization is immutable to allow query objects to be reused in multiple places.
 *
 * @param T The TypeScript type used to represent the data in the samples of the `TimeSeries`.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeRangeQuery`.
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
