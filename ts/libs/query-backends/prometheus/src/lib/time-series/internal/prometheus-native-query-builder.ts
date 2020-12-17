import { NativeQueryBuilderBase, TimeSeriesQuery, TimeSeriesQueryResultType } from '@sloc/core';
import { PrometheusConfig } from '../../config';
import { PrometheusNativeQuery } from './prometheus-native-query';

export class PrometheusNativeQueryBuilder extends NativeQueryBuilderBase {

    constructor(private config: PrometheusConfig) {
        super();
    }

    buildQuery(resultType: TimeSeriesQueryResultType): TimeSeriesQuery<any> {
        const queryStr = this.buildPromQlQuery();
        return new PrometheusNativeQuery(this.config, resultType, this.selectSegment, queryStr);
    }

    private buildPromQlQuery(): string {
        const query = `${this.selectSegment.appName}_${this.selectSegment.metricName}`;

        // ToDo

        return query;
    }

}
