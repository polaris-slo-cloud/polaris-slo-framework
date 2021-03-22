import {
    AggregateByGroupQueryContent,
    AggregationType,
    BinaryOperationQueryContent,
    BinaryOperationWithConstOperandQueryContent,
    BinaryOperator,
    DBFunctionName,
    Duration,
    FilterOnLabelQueryContent,
    FunctionQueryContent,
    Index,
    IndexByKey,
    JoinConfig,
    JoinGrouping,
    LabelComparisonOperator,
    LabelFilter,
    LabelJoinOptions,
    NativeQueryBuilderBase,
    QueryContentType,
    QueryError,
    SubqueryBuilderContainer,
    TimeRange,
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

/**
 * Maps the `BinaryOperator` values to the operator strings of PromQL.
 */
const BINARY_OPS_MAP: Index<BinaryOperator, string> = {
    [BinaryOperator.Add]: '+',
    [BinaryOperator.Subtract]: '-',
    [BinaryOperator.Multiply]: '*',
    [BinaryOperator.Divide]: '/',
    [BinaryOperator.Modulo]: '%',
    [BinaryOperator.Power]: '^',
    [BinaryOperator.Union]: 'or',
    [BinaryOperator.Intersection]: 'and',
    [BinaryOperator.Complement]: 'unless',
}

/**
 * Maps the AggregationType values to the names of native PromQL aggregation functions.
 */
const FUNCTIONS_MAP: Index<DBFunctionName, string> = {
    rate: 'rate',
    averageOverTime: 'avg_over_time',
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

        const timeRangeStr = this.serializeTimeRange(this.selectSegment.range);
        if (timeRangeStr) {
            query = query + timeRangeStr;
        }

        this.queryChainAfterSelect.forEach(segment => {
            switch (segment.contentType) {
                case QueryContentType.AggregateByGroup:
                    query = this.buildAggregationByGroup(segment as AggregateByGroupQueryContent, query);
                    break;
                case QueryContentType.BinaryOperation:
                    query = this.buildBinaryOperation(segment as SubqueryBuilderContainer<BinaryOperationQueryContent>, query);
                    break;
                case QueryContentType.BinaryOperationWithConstant:
                    query = this.buildBinaryOperationWithConstant(segment as BinaryOperationWithConstOperandQueryContent, query);
                    break;
                case QueryContentType.Function:
                    query = this.buildFunctionCall(segment as FunctionQueryContent, query);
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

    private buildBinaryOperation(queryContent: SubqueryBuilderContainer<BinaryOperationQueryContent>, leftOperandQuery: string): string {
        const nativeBinOp = BINARY_OPS_MAP[queryContent.operator];
        if (!nativeBinOp) {
            throw new QueryError(`Unknown binary operator '${queryContent.operator}'`);
        }
        if (queryContent.subqueryBuilders.length !== 1) {
            throw new QueryError('A binary operation must have exactly one query subquery as right operand.', queryContent);
        }

        const rightOperandQuery = (queryContent.subqueryBuilders[0] as PrometheusNativeQueryBuilder).buildPromQlQuery();
        const joinConfig = this.serializeJoinConfig(queryContent.joinConfig);

        return `(${leftOperandQuery} ${nativeBinOp} ${joinConfig} (${rightOperandQuery}))`;
    }

    private buildBinaryOperationWithConstant(queryContent: BinaryOperationWithConstOperandQueryContent, leftOperandQuery: string): string {
        const nativeBinOp = BINARY_OPS_MAP[queryContent.operator];
        if (!nativeBinOp) {
            throw new QueryError(`Unknown binary operator '${queryContent.operator}'`);
        }

        // eslint-disable-next-line @typescript-eslint/ban-types
        return `(${leftOperandQuery}) ${nativeBinOp} (${(queryContent.rightOperand as object).toString()})`
    }

    private buildFunctionCall(queryContent: FunctionQueryContent, innerQuery: string): string {
        const nativeFn = FUNCTIONS_MAP[queryContent.functionName];
        if (!nativeFn) {
            throw new QueryError(`Unknown DB function '${queryContent.functionName}'`);
        }

        const params = this.serializeFunctionParams(queryContent.params);

        return `${nativeFn}(${params}${innerQuery})`;
    }

    private serializeTimeRange(range: TimeRange): string {
        if (!range) {
            return null;
        }

        const duration = `[${this.serializeDuration(range.duration)}]`;
        if (range.endsNow()) {
            return duration;
        }

        let offset = range.offset;
        if (!offset) {
            const offsetMs = new Date().valueOf() - range.end;
            if (offsetMs > 0) {
                offset = Duration.fromMilliseconds(offsetMs);
            }
        }
        if (offset) {
            return `${duration} offset ${this.serializeDuration(offset)}`;
        }
        return duration;
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

    private serializeDuration(duration: Duration): string {
        return Math.ceil(duration.valueMs / 1000).toString() + 's';
    }

    private serializeJoinConfig(joinConfig: JoinConfig): string {
        if (!joinConfig) {
            return '';
        }

        let labelsConfig = '';
        if (joinConfig.labels && joinConfig.labels.length > 0) {
            const labelsStr = joinConfig.labels.join();
            switch (joinConfig.labelOptions) {
                case LabelJoinOptions.On:
                    labelsConfig = `on(${labelsStr})`;
                    break;
                case LabelJoinOptions.Ignoring:
                    labelsConfig = `ignoring(${labelsStr})`;
                    break;
                default:
                    break;
            }
        }

        let groupingConfig = '';
        if (joinConfig.grouping) {
            const additionalLabels = joinConfig.additionalLabelsFromOneSide ? joinConfig.additionalLabelsFromOneSide.join() : '';
            switch (joinConfig.grouping) {
                case JoinGrouping.Left:
                    groupingConfig = `group_left(${additionalLabels})`;
                    break;
                case JoinGrouping.Right:
                    groupingConfig = `grouping_right(${additionalLabels})`;
                    break;
                default:
                    break;
            }
        }

        if (labelsConfig || groupingConfig) {
            return `${labelsConfig} ${groupingConfig}`;
        }
        return '';
    }

}
