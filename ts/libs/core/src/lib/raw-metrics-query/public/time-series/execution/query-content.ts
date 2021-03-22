
/**
 * Describes the type of a certain query content, i.e., the action that is executed.
 */

import { IndexByKey } from '../../../../util';
import { LabelFilter, TimeRange, TimeSeriesQuery, ValueFilter } from '../query-model';
import { JoinConfig } from '../query-model/join-config';
import { BinaryOperator } from './binary-operator';
import { DBFunctionName } from './db-functions';

// eslint-disable-next-line no-shadow
export enum QueryContentType {

    /** A query that selects a metric with a particular name, optionally within a time range. */
    Select = 'selectQuery',

    /** A query that applies a filter on the labels of the `TimeSeries`. */
    FilterOnLabel = 'filterOnLabelQuery',

    /** A query that applies a filter on the value(s) of the `TimeSeries`. */
    FilterOnValue = 'filterOnValueQuery',

    /** A query that applies a binary operator with two queries as operands. */
    BinaryOperation = 'binaryOperationQuery',

    /** A query that applies a binary operator with right operand being a constant. */
    BinaryOperationWithConstant = 'binaryOperationWithConstOperandQuery',

    /** Changes the resolution of the current range query. */
    ChangeResolution = 'changeResolutionQuery',

    /**
     * Groups the `TimeSeries` by specified label values and performs an aggregation
     * function on the data within each group.
     */
    AggregateByGroup = 'aggregateByGroupQuery',

    /**
     * A query that applies a DB-native function to the `TimeSeries`.
     *
     * If the DB does not support a particular function, the query library may
     * emulate the behavior in SLOC code.
     */
    Function = 'functionQuery',

}

/**
 * Represents the content of a query in a DB agnostic way.
 */
export interface QueryContent {

    /** The type of query content. */
    contentType: QueryContentType;

}

/**
 * Provides a unified way for storing subqueries
 */
export interface SubqueryQueryContent extends QueryContent {

    /** The subqueries used in the parent query. */
    subqueries: TimeSeriesQuery<any>[];

}

export interface SelectQueryContent extends QueryContent {

    contentType: QueryContentType.Select;

    /** The name of the app for which the metric should be selected. */
    appName: string;

    /** The name of the metric that should be selected. */
    metricName: string;

    /** The `TimeRange` within which the selected samples of the `TimeSeries` should lie. */
    range: TimeRange;

}


export interface FilterOnLabelQueryContent extends QueryContent {

    contentType: QueryContentType.FilterOnLabel;

    filter: LabelFilter;

}

export interface FilterOnValueQueryContent extends QueryContent {

    contentType: QueryContentType.FilterOnValue;

    filter: ValueFilter;

}

/**
 * Models a binary operation with two queries as operands.
 */
export interface BinaryOperationQueryContent extends SubqueryQueryContent {

    contentType: QueryContentType.BinaryOperation;

    operator: BinaryOperator;

    joinConfig?: JoinConfig;

}

/**
 * Models a binary operation with a constant as the right operand.
 */
export interface BinaryOperationWithConstOperandQueryContent extends QueryContent {

    contentType: QueryContentType.BinaryOperation;

    operator: BinaryOperator;

    rightOperand: any;

}

export interface ChangeResolutionQueryContent extends QueryContent {

    contentType: QueryContentType.ChangeResolution;

    /** The new resolution in seconds */
    resolutionSec: number;

}

export interface FunctionQueryContent extends QueryContent {

    contentType: QueryContentType.Function;

    functionName: DBFunctionName;

    params?: IndexByKey<string>;

}

export type AggregationType = 'sum' | 'min' | 'max' | 'avg'; // ToDo: extend

export interface AggregateByGroupQueryContent extends QueryContent {

    contentType: QueryContentType.AggregateByGroup,

    aggregationType: AggregationType;

    groupByLabels?: string[];

    params?: IndexByKey<string>;

}


/**
 * Maps the QueryContentTypes to their respective interfaces.
 */
export interface QueryContentTypeMapping {
    selectQuery: SelectQueryContent;
    filterOnLabelQuery: FilterOnLabelQueryContent;
    filterOnValueQuery: FilterOnValueQueryContent;
    binaryOperationQuery: BinaryOperationQueryContent;
    binaryOperationWithConstOperandQuery: BinaryOperationWithConstOperandQueryContent;
    changeResolutionQuery: ChangeResolutionQueryContent;
    functionQuery: FunctionQueryContent
    aggregateByGroupQuery: AggregateByGroupQueryContent;
}

/**
 * Convenience function to create a `QueryContent` object.
 *
 * @param type The type of `QueryContent`.
 * @param content The actual `QueryContent`.
 * @returns A new `QueryContent` object of the specified type with `content`.
 */
export function createQueryContent<T extends QueryContentType, Q extends QueryContentTypeMapping[T]>(type: T, content: Omit<Q, 'contentType'>): Q {
    return {
        contentType: type,
        ...content,
    } as any;
}
