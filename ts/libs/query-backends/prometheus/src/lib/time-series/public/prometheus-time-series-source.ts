import { LabelFilterableTimeInstantQuery, LabelFilterableTimeRangeQuery, TimeRange, TimeSeriesSource } from '@sloc/core';
import { PrometheusConfig } from '../../config';


export class PrometheusTimeSeriesSource implements TimeSeriesSource {

    readonly name = 'sloc.time-series-sources.Prometheus';

    constructor(config: PrometheusConfig) {

    }

    select<T = any>(appName: string, metricName: string): LabelFilterableTimeInstantQuery<T>;
    select<T = any>(appName: string, metricName: string, range: TimeRange): LabelFilterableTimeRangeQuery<T>;
    select<T = any>(appName: string, metricName: string, range?: TimeRange): LabelFilterableTimeInstantQuery<T> | LabelFilterableTimeRangeQuery<T>{
        throw new Error('Method not implemented.');
    }

}
