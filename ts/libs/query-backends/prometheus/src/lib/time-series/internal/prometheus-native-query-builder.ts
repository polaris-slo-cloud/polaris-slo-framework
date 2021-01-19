import {
    AggregateByGroupQueryContent,
    AggregationType,
    FilterOnLabelQueryContent,
    Index,
    IndexByKey,
    LabelComparisonOperator,
    LabelFilter,
    NativeQueryBuilderBase,
    QueryContentType,
    QueryError,
    TimeSeriesQuery,
    TimeSeriesQueryResultType,
} from '@sloc/core';
import { PrometheusConfig } from '../../config';
import { PrometheusNativeQuery } from './prometheus-native-query';

/**
 * Maps the AggregationType values to the names of native PromQL aggregation functions.
 */
const AGGREGATIONS_MAP: Index<AggregationType, string> = {
    sum: 'sum',
    min: 'min',
    max: 'max',
    avg: 'avg',
};

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
        // The time range is handled by PrometheusNativeQuery.execute()

        this.queryChainAfterSelect.forEach(segment => {
            if (segment.contentType === QueryContentType.FilterOnLabel) {
                labelFilters.push(this.buildLabelFilter((segment as FilterOnLabelQueryContent).filter));
            }
        });

        let query = selectStatement;
        if (labelFilters.length > 0) {
            const filterStr = labelFilters.join(',');
            query = `${selectStatement}{${filterStr}}`;
        }

        this.queryChainAfterSelect.forEach(segment => {
            switch (segment.contentType) {
                case QueryContentType.AggregateByGroup:
                    query = this.buildAggregationByGroup(segment as AggregateByGroupQueryContent, query);
                    break;
                default:
                    break;
            }
        });


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

    private buildAggregationByGroup(queryContent: AggregateByGroupQueryContent, innerQuery: string): string {
        const nativeAggregationFn = AGGREGATIONS_MAP[queryContent.aggregationType];
        if (!nativeAggregationFn) {
            throw new QueryError(`Unknown aggregation function '${queryContent.aggregationType}'`);
        }

        let grouping: string;
        if (queryContent.groupByLabels) {
            grouping = `by (${queryContent.groupByLabels.join()})`
        } else {
            grouping = '';
        }

        const params = this.serializeFunctionParams(queryContent.params);

        return `${nativeAggregationFn} ${grouping}(${params}${innerQuery})`;
    }

    private serializeFunctionParams(params?: IndexByKey<string>): string {
        if (!params) {
            return '';
        }

        const values = Object.values(params);
        if (values.length > 0) {
            return values.join() + ', ';
        }
        return '';
    }

}
