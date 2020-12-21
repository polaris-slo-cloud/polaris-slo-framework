import {
    LabelFilter,
    LabelFilterableTimeInstantQuery,
    LabelFilterableTimeRangeQuery,
    TimeInstantQuery,
    TimeRangeQuery,
    TimeSeries,
    TimeSeriesInstant,
} from '../query-model';
import { FilterOnLabelQueryContent, QueryContent, QueryContentType } from './query-content';
import { TimeInstantQueryBase } from './time-instant-query.base';
import { TimeRangeQueryBase } from './time-range-query.base';
import { TimeSeriesQueryBase } from './time-series-query.base';

/**
 * Default implementation of the `TimeRangeQuery` interface.
 */
export class TimeRangeQueryImpl<T> extends TimeRangeQueryBase<T> {

    protected createTimeRangeQuery(queryContent: QueryContent): TimeRangeQuery<any> & TimeSeriesQueryBase<TimeSeries<any>> {
        return new TimeRangeQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

    protected createTimeInstantQuery(queryContent: QueryContent): TimeInstantQuery<any> & TimeSeriesQueryBase<TimeSeriesInstant<any>> {
        return new TimeInstantQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

}

/**
 * Default implementation of the `LabelFilterableTimeRangeQuery` interface.
 *
 * This class should be instantiated with a `NativeQueryBuilderFactoryFn` implementation for a specific DB.
 */
export class LabelFilterableTimeRangeQueryImpl<T> extends TimeRangeQueryImpl<T> implements LabelFilterableTimeRangeQuery<T> {

    filterOnLabel(predicate: LabelFilter): LabelFilterableTimeRangeQuery<T> {
        const queryContent: FilterOnLabelQueryContent = {
            contentType: QueryContentType.FilterOnLabel,
            filter: predicate,
        };
        return new LabelFilterableTimeRangeQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

}


/**
 * Default implementation of the `TimeInstantQuery` interface.
 */
export class TimeInstantQueryImpl<T> extends TimeInstantQueryBase<T> {

    protected createTimeRangeQuery(queryContent: QueryContent): TimeRangeQuery<any> & TimeSeriesQueryBase<TimeSeries<any>> {
        return new TimeRangeQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

    protected createTimeInstantQuery(queryContent: QueryContent): TimeInstantQuery<any> & TimeSeriesQueryBase<TimeSeriesInstant<any>> {
        return new TimeInstantQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

}

/**
 * Default implementation of the `LabelFilterableTimeInstantQuery` interface.
 *
 * This class should be instantiated with a `NativeQueryBuilderFactoryFn` implementation for a specific DB.
 */
export class LabelFilterableTimeInstantQueryImpl<T> extends TimeInstantQueryImpl<T> implements LabelFilterableTimeInstantQuery<T> {

    filterOnLabel(predicate: LabelFilter): LabelFilterableTimeInstantQuery<T> {
        const queryContent: FilterOnLabelQueryContent = {
            contentType: QueryContentType.FilterOnLabel,
            filter: predicate,
        };
        return new LabelFilterableTimeInstantQueryImpl(this, queryContent, this.queryBuilderFactoryFn);
    }

}
