import { DataType, DataTypeMappings } from './data-types';
import { SlocQuery } from './sloc-query';
import { TimeSeries, TimeSeriesInstant } from './time-series';

export interface TimeSeriesFilter {

}

/**
 * Defines a range in time beginning at `start` and stopping at `end` (both inclusive).
 */
export interface TimeRange {

    /** The Unix timestamp when this time range starts (inclusive). */
    start: number;

    /** The Unix timestamp when this time range ends (inclusive). */
    end: number;
}

/**
 * A query that rsults in `TimeSeries` and which provides operations that are
 * applicable to all `TimeSeries` queries.
 */
export interface TimeSeriesQuery<T extends TimeSeries<any, any>, Q extends TimeSeriesQuery<T, any>> extends SlocQuery<T> {

    /**
     * Filters the input `TimeSeries` using the provided `predicate`, i.e., only
     * `TimeSeries` that fulfill the `predicate` constitute the output of the filter operation.
     *
     * @param predicate The predicate that all output `TimeSeries` must fulfill.
     * @returns A new `TimeSeriesQuery`, whose results are all the input `TimeSeries` that fulfill the `predicate`.
     */
    filter(predicate: TimeSeriesFilter): Q;

}


/**
 * A query that results in `TimeSeries` that cover a range of time, i.e., they normally contain
 * multiple samples.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeInstantQuery`.
 */
export interface TimeRangeQuery<D extends DataType, T = DataTypeMappings[D]> extends TimeSeriesQuery<TimeSeries<D, T>, TimeRangeQuery<D, T>> {

}

/**
 * A query that results in `TimeSeriesInstants`, i.e., each contains only a single sample.
 *
 * @note Some methods may return a query of a different type, e.g., a `TimeRangeQuery`.
 */
export interface TimeInstantQuery<D extends DataType, T = DataTypeMappings[D]> extends TimeSeriesQuery<TimeSeriesInstant<D, T>, TimeInstantQuery<D, T>> {

    /**
     * Retrieves all the input `TimeSeries` in the specified time range.
     *
     * @param range The `TimeRange`, within which to get the `TimeSeries`.
     */
    range(range: TimeRange): TimeRangeQuery<D, T>;

}
