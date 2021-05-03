// eslint doesn't seem to handle manual typings correctly, so we disable these rules here.
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    DataType,
    IndexByKey,
    QueryError,
    Sample,
    SelectQueryContent,
    SlocQueryResult,
    TimeSeries,
    TimeSeriesInstant,
    TimeSeriesQuery,
    TimeSeriesQueryResultType,
} from '@polaris-sloc/core';
import { InstantVector, Metric as PromMetric, SampleValue as PromSample, PrometheusDriver, RangeVector } from 'prometheus-query';
import { Observable, from as observableFrom } from 'rxjs';
import { PrometheusConfig } from '../../config';

const DEFAULT_PORT = 9090;

/**
 * The configuration expected by the `prometheus-query` library.
 */
interface PrometheusQueryConfig extends Omit<PrometheusConfig, 'useTLS' | 'port' | 'host'>  {
    endpoint: string;
}

export class PrometheusNativeQuery implements TimeSeriesQuery<any> {

    constructor(
        private config: PrometheusConfig,
        public resultType: TimeSeriesQueryResultType,
        private selectSegment: SelectQueryContent,
        private promQlQuery: string,
    ) { }

    execute(): Promise<SlocQueryResult<TimeSeries<any>>> {
        const config = this.buildPrometheusQueryConfig();
        // console.log(config);
        // console.log(this.promQlQuery);
        const promQuery = new PrometheusDriver(config);

        switch (this.resultType) {
            case TimeSeriesQueryResultType.Instant:
                return promQuery.instantQuery(this.promQlQuery)
                    .then(result => this.transformInstantQueryResult(result.result));

            case TimeSeriesQueryResultType.Range:
                return promQuery.rangeQuery(this.promQlQuery, this.selectSegment.range.start, this.selectSegment.range.end, undefined)
                    .then(result => this.transformRangeQueryResult(result.result));

            default:
                throw new QueryError('Invalid TimeSeriesQueryResultType', this);
        }
    }

    toObservable(): Observable<SlocQueryResult<TimeSeries<any>>> {
        return observableFrom(this.execute());
    }

    private transformInstantQueryResult(instantVectors: InstantVector[]): SlocQueryResult<TimeSeries<any>> {
        const slocResults: TimeSeriesInstant<any>[] = instantVectors.map(instant => {
            const slocInstant: TimeSeriesInstant<any> = this.transformMetricToTimeSeries(instant.metric) as any;
            slocInstant.samples = [ this.transformSample(instant.value) ];
            slocInstant.start = slocInstant.samples[0].timestamp;
            slocInstant.end = slocInstant.start;
            return slocInstant;
        });

        return { results: slocResults };
    }

    private transformRangeQueryResult(rangeVectors: RangeVector[]): SlocQueryResult<any> {
        const slocResults: TimeSeries<any>[] = rangeVectors.map(promSeries => {
            const slocSeries = this.transformMetricToTimeSeries(promSeries.metric);
            slocSeries.samples = promSeries.values.map(promSample => this.transformSample(promSample));
            slocSeries.start = slocSeries.samples[0].timestamp;
            slocSeries.end = slocSeries.samples[slocSeries.samples.length - 1].timestamp;
            return slocSeries;
        });

        return { results: slocResults };
    }

    private transformMetricToTimeSeries(promMetric: PromMetric): TimeSeries<any> {
        return {
            dataType: DataType.Float,
            metricName: promMetric.name,
            labels: promMetric.labels as IndexByKey<string>,
            samples: null,
            start: null,
            end: null,
        };
    }

    private transformSample(promSample: PromSample): Sample<any> {
        return {
            timestamp: promSample.time.valueOf(),
            value: promSample.value,
        };
    }

    private buildPrometheusQueryConfig(): PrometheusQueryConfig {
        const { useTLS, port, host, ...partialConfig } = this.config;
        const protocol = useTLS ? 'https' : 'http';
        const endpoint = `${protocol}://${host}:${port || DEFAULT_PORT}`;

        const ret: PrometheusQueryConfig = partialConfig as any;
        ret.endpoint = endpoint;
        return ret;
    }

}
