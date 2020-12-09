
/**
 * Describes the type of a certain query content, i.e., the action that is executed.
 */

import { IndexByKey } from '../../../../util';
import { LabelFilter, TimeRange, ValueFilter } from '../query-model';

// eslint-disable-next-line no-shadow
export enum QueryContentType {

    /** A query that selects a metric with a particular name, optionally within a time range. */
    Select = 'select',

    /** A query that applies a filter on the labels of the `TimeSeries`. */
    FilterOnLabel = 'filterOnLabel',

    /** A query that applies a filter on the value(s) of the `TimeSeries`. */
    FilterOnValue = 'filterOnValue',

    /** A query that applies a DB-native function to the `TimeSeries`. */
    Function = 'function',

    /**
     * A query that applies a function to the `TimeSeries`,
     * which is not natively supported by the DB and thus needs to be
     * executed by SLOC code.
     */
    NonNativeFunction = 'nonNativeFunction',

}

/**
 * Represents the content of a query in a DB agnostic way.
 */
export interface QueryContent {

    /** The type of query content. */
    contentType: QueryContentType;

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

export interface FilterOnValueQuery extends QueryContent {

    contentType: QueryContentType.FilterOnValue;

    filter: ValueFilter;

}


export interface FunctionQueryContent extends QueryContent {

    contentType: QueryContentType.Function;

    functionName: string;

    params?: IndexByKey<string>;

}

export interface NonNativeFunctionQueryContent extends QueryContent {

    contentType: QueryContentType.NonNativeFunction;

    // ToDo

}


/**
 * Maps the QueryContentTypes to their respective interfaces.
 */
export interface QueryContentTypeMapping {
    select: SelectQueryContent;
    filterOnLabel: FilterOnLabelQueryContent;
    filterOnValue: any;
    function: FunctionQueryContent
    nonNativeFunction: NonNativeFunctionQueryContent;
}
