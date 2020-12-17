import {
    FilterOnLabelQueryContent,
    LabelComparisonOperator,
    LabelFilter,
    NativeQueryBuilderBase,
    QueryContentType,
    TimeSeriesQuery,
    TimeSeriesQueryResultType,
} from '@sloc/core';
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
        const selectStatement = `${this.selectSegment.appName}_${this.selectSegment.metricName}`;
        const labelFilters: string[] = [];

        this.queryChainAfterSelect.forEach(segment => {
            switch (segment.contentType) {
                case QueryContentType.FilterOnLabel:
                    labelFilters.push(this.buildLabelFilter((segment as FilterOnLabelQueryContent).filter));
                    break;
                default:
                    break;
            }
        });

        let query = selectStatement;
        if (labelFilters.length > 0) {
            const filterStr = labelFilters.join(',');
            query = `${selectStatement}{${filterStr}}`;
        }

        return query;
    }

    private buildLabelFilter(labelFilter: LabelFilter): string {
        let operator: string;
        switch (labelFilter.operator) {
            case LabelComparisonOperator.Equal:
                operator = '=';
                break;
            case LabelComparisonOperator.NotEqual:
                operator = '!=';
                break;
            case LabelComparisonOperator.RegexMatch:
                operator = '=~';
                break;
            default:
                break;
        }

        return `${labelFilter.label}${operator}'${labelFilter.comparisonValue}'`;
    }

}
