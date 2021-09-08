import { LabelFilterableTimeInstantQuery, LabelFilterableTimeRangeQuery, TimeRange, TimeSeriesSource } from '../query-model';
import { NativeQueryBuilderFactoryFn } from './native-query-builder';
import { QueryContentType, SelectQueryContent } from './query-content';
import { LabelFilterableTimeInstantQueryImpl, LabelFilterableTimeRangeQueryImpl } from './time-series-queries.impl';

/**
 * Common superclass for `TimeSeriesSource` implementations that want to reuse the existing
 * `TimeSeriesQuery` implementations.
 *
 * When implementing this abstract class, only a `name` and a getter for the `NativeQueryBuilderFactoryFn`
 * need to be provided.
 */
export abstract class TimeSeriesSourceBase implements TimeSeriesSource {

    abstract fullName: string;

    /**
     * @returns The `NativeQueryBuilderFactoryFn` used to create new `NativeQueryBuilders` for the DB.
     */
    protected abstract getNativeQueryBuilderFactory(): NativeQueryBuilderFactoryFn;

    select<T = any>(appName: string, metricName: string): LabelFilterableTimeInstantQuery<T>;
    select<T = any>(appName: string, metricName: string, range: TimeRange): LabelFilterableTimeRangeQuery<T>;
    select<T = any>(appName: string, metricName: string, range?: TimeRange): LabelFilterableTimeInstantQuery<T> | LabelFilterableTimeRangeQuery<T>{
        const queryBuilderFactory = this.getNativeQueryBuilderFactory();
        const queryContent: SelectQueryContent = {
            contentType: QueryContentType.Select,
            appName,
            metricName,
            range,
        };
        if (range) {
            return new LabelFilterableTimeRangeQueryImpl(null, queryContent, queryBuilderFactory);
        } else {
            return new LabelFilterableTimeInstantQueryImpl(null, queryContent, queryBuilderFactory);
        }
    }

}
