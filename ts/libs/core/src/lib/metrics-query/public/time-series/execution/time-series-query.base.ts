import { Observable } from 'rxjs';
import { SlocQueryBase, SlocQueryResult } from '../../generic';
import { TimeInstantQuery, TimeRangeQuery, TimeSeries, TimeSeriesInstant, TimeSeriesQuery } from '../query-model';
import { NativeQueryBuilderFactoryFn } from './native-query-builder';
import { QueryContent, QueryContentType, QueryContentTypeMapping } from './query-content';

/**
 * Common superclass for all `TimeSeriesQuery` implementations.
 *
 * This class takes care of storing the `QueryContent` and executing the `NativeQueryBuilder` to
 * assemble a DB-native query, as well as executing it.
 */
export abstract class TimeSeriesQueryBase<T extends TimeSeries<any>> extends SlocQueryBase<T> implements TimeSeriesQuery<T> {

    /** The actual content of this query. */
    protected queryContent: QueryContent;

    /** The factory used to create a new NativeQueryBuilder instance. */
    protected queryBuilderFactoryFn: NativeQueryBuilderFactoryFn;

    /**
     * Creates a new instance of `TimeSeriesQueryBase`.
     *
     * @param predecessor The query that precedes this one in the chain. This should be `null`,
     * if this is the first query in the chain.
     * @param queryContent The actual content of this query.
     * @param queryBuilderFactoryFn The factory used to create a new NativeQueryBuilder instance.
     */
    constructor(predecessor: TimeSeriesQueryBase<any>, queryContent: QueryContent, queryBuilderFactoryFn: NativeQueryBuilderFactoryFn) {
        super(predecessor);
        this.queryContent = queryContent;
        this.queryBuilderFactoryFn = queryBuilderFactoryFn;
    }

    /**
     * Creates a new instance of a `TimeRangeQuery` and sets its query content.
     */
    protected abstract createTimeRangeQuery(queryContent: QueryContent): TimeRangeQuery<any> & TimeSeriesQueryBase<TimeSeries<any>>;

    /**
     * Creates a new instance of a `TimeInstantQuery` and sets its query content.
     */
    protected abstract createTimeInstantQuery(queryContent: QueryContent): TimeInstantQuery<any> & TimeSeriesQueryBase<TimeSeriesInstant<any>>;

    protected executeInternal(queryChain: TimeSeriesQueryBase<T>[]): Promise<SlocQueryResult<T>> {
        const query = this.buildNativeQuery(queryChain);
        return query.execute();
    }

    protected toObservableInternal(queryChain: TimeSeriesQueryBase<T>[]): Observable<SlocQueryResult<T>> {
        const query = this.buildNativeQuery(queryChain);
        return query.toObservable();
    }

    /**
     * Builds a native query from the provided `queryChain`.
     */
    protected buildNativeQuery(queryChain: TimeSeriesQueryBase<T>[]): TimeSeriesQuery<T> {
        const builder = this.queryBuilderFactoryFn();
        queryChain.forEach(queryPart => builder.addQuery(queryPart.queryContent));
        return builder.buildQuery();
    }

}
