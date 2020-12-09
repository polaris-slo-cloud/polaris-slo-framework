import { TimeInstantQuery, TimeRangeQuery, TimeSeries, ValueFilter } from '../query-model';
import { FilterOnValueQueryContent, QueryContentType } from './query-content';
import { TimeSeriesQueryBase } from './time-series-query.base';

/**
 * This class contains the implementation of all methods defined by the `TimeRangeQuery` interface.
 *
 * It does not contain implementations for the two abstract factory methods for new queries defined
 * in `TimeSeriesQueryBase`, because that would create a circular dependency between this file and the one
 * containing the `TimeInstantQuery` implementation. The classes implementing these methods are contained
 * in a single file (time-series-queries.impl.ts`).
 */
export abstract class TimeRangeQueryBase<T> extends TimeSeriesQueryBase<TimeSeries<T>> implements TimeRangeQuery<T> {

    countChanges(): TimeInstantQuery<T> {
        throw new Error('Method not implemented.');
    }

    filterOnValue(predicate: ValueFilter): TimeRangeQuery<T> {
        const queryContent: FilterOnValueQueryContent = {
            contentType: QueryContentType.FilterOnValue,
            filter: predicate,
        };
        return this.createTimeRangeQuery(queryContent);
    }

}
