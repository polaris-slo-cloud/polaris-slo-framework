import { SlocQueryResult, TimeSeriesQuery, TimeSeriesQueryResultType } from '@sloc/core';
import { PrometheusQuery } from 'prometheus-query';
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

    constructor(private config: PrometheusConfig, public resultType: TimeSeriesQueryResultType, private promQlQuery: string) { }

    execute(): Promise<SlocQueryResult<any>> {
        const config = this.buildPrometheusQueryConfig();
        const promQuery = new PrometheusQuery(config);

        if (this.resultType === TimeSeriesQueryResultType.Instant) {

        }
        throw new Error('Not implemented');
    }

    toObservable(): Observable<SlocQueryResult<any>> {
        return observableFrom(this.execute());
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
