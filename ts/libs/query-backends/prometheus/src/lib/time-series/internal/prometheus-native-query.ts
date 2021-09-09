// eslint doesn't seem to handle manual typings correctly, so we disable these rules here.
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
    DataType,
    IndexByKey,
    PolarisQueryResult,
    QueryError,
    Sample,
    SelectQueryContent,
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

    execute(): Promise<PolarisQueryResult<TimeSeries<any>>> {
        const config = this.buildPrometheusQueryConfig();
        // Logger.log(config);
        // Logger.log(this.promQlQuery);
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

    toObservable(): Observable<PolarisQueryResult<TimeSeries<any>>> {
        return observableFrom(this.execute());
    }

    private transformInstantQueryResult(instantVectors: InstantVector[]): PolarisQueryResult<TimeSeries<any>> {
        const polarisResults: TimeSeriesInstant<any>[] = instantVectors.map(instant => {
            const polarisInstant: TimeSeriesInstant<any> = this.transformMetricToTimeSeries(instant.metric) as any;
            polarisInstant.samples = [ this.transformSample(instant.value) ];
            polarisInstant.start = polarisInstant.samples[0].timestamp;
            polarisInstant.end = polarisInstant.start;
            return polarisInstant;
        });

        return { results: polarisResults };
    }

    private transformRangeQueryResult(rangeVectors: RangeVector[]): PolarisQueryResult<any> {
        const polarisResults: TimeSeries<any>[] = rangeVectors.map(promSeries => {
            const polarisSeries = this.transformMetricToTimeSeries(promSeries.metric);
            polarisSeries.samples = promSeries.values.map(promSample => this.transformSample(promSample));
            polarisSeries.start = polarisSeries.samples[0].timestamp;
            polarisSeries.end = polarisSeries.samples[polarisSeries.samples.length - 1].timestamp;
            return polarisSeries;
        });

        return { results: polarisResults };
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
