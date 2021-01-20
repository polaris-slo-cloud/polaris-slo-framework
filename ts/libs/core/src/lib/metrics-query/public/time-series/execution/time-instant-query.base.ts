import { TimeInstantQuery, TimeSeriesInstant, TimeSeriesQueryResultType, ValueFilter } from '../query-model';
import { FilterOnValueQueryContent, QueryContentType, createQueryContent } from './query-content';
import { TimeSeriesQueryBase } from './time-series-query.base';

/**
 * This class contains the implementation of all methods defined by the `TimeInstantQuery` interface.
 *
 * It does not contain implementations for the two abstract factory methods for new queries defined
 * in `TimeSeriesQueryBase`, because that would create a circular dependency between this file and the one
 * containing the `TimeRangeQuery` implementation. The classes implementing these methods are contained
 * in a single file (time-series-queries.impl.ts`).
 */
export abstract class TimeInstantQueryBase<T> extends TimeSeriesQueryBase<TimeSeriesInstant<T>> implements TimeInstantQuery<T> {

    readonly resultType: TimeSeriesQueryResultType.Instant = TimeSeriesQueryResultType.Instant;

    abs(): TimeInstantQuery<T> {
        throw new Error('Method not implemented.');
    }

    add(addend: TimeInstantQuery<T>): TimeInstantQuery<T> {
        throw new Error('Method not implemented.');
    }

    sumByGroup(...groupingLabels: string[]): TimeInstantQuery<number> {
        const queryContent = createQueryContent(
            QueryContentType.AggregateByGroup,
            {
                aggregationType: 'sum',
                groupByLabels: groupingLabels && groupingLabels.length > 0 ? groupingLabels : undefined,
            },
        );
        return this.createTimeInstantQuery(queryContent);
    }

    filterOnValue(predicate: ValueFilter): TimeInstantQuery<T> {
        const queryContent: FilterOnValueQueryContent = {
            contentType: QueryContentType.FilterOnValue,
            filter: predicate,
        };
        return this.createTimeInstantQuery(queryContent);
    }

}
