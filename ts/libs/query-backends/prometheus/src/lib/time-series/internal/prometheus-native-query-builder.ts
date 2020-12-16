import { NativeQueryBuilderBase, TimeSeriesQuery, TimeSeriesQueryResultType } from '@sloc/core';
import { PrometheusConfig } from '../../config';
import { PrometheusNativeQuery } from './prometheus-native-query';

export class PrometheusNativeQueryBuilder extends NativeQueryBuilderBase {

    constructor(private config: PrometheusConfig) {
        super();
    }

    buildQuery(resultType: TimeSeriesQueryResultType): TimeSeriesQuery<any> {
        const queryStr = this.buildPromQlQuery();
        return new PrometheusNativeQuery(this.config, resultType, queryStr);
    }

    private buildPromQlQuery(): string {
        return '';
    }

}
