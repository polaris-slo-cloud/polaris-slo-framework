
/**
 * Describes the type of a certain query content, i.e., the action that is executed.
 */

import { IndexByKey } from '../../../../util';
import { LabelFilter, TimeRange } from '../query-model';

// eslint-disable-next-line no-shadow
export enum QueryContentType {

    /** A query that selects a metric with a particular name, optionally within a time range. */
    Select,

    /** A query that applies a filter on the labels of the `TimeSeries`. */
    FilterOnLabel,

    /** A query that applies a filter on the value(s) of the `TimeSeries`. */
    FilterOnValue,

    /** A query that applies a DB-native function to the `TimeSeries`. */
    Function,

    /**
     * A query that applies a function to the `TimeSeries`,
     * which is not natively supported by the DB and thus needs to be
     * executed by SLOC code.
     */
    NonNativeFunction,

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

    /** The name of the metric that should be selected. */
    metricName: string;

    /** The `TimeRange` within which the selected samples of the `TimeSeries` should lie. */
    range: TimeRange;

}


export interface FilterOnLabelQueryContent extends QueryContent {

    contentType: QueryContentType.FilterOnLabel;

    filter: LabelFilter;

}

// ToDo
// export interface FilterOnValueQuery extends QueryContent {
//     contentType: QueryContentType.FilterOnValue;
//     // ToDo
// }


export interface FunctionQuery extends QueryContent {

    contentType: QueryContentType.Function;

    functionName: string;

    params?: IndexByKey<string>;

}

export interface NonNativeFunctionQuery extends QueryContent {

    contentType: QueryContentType.NonNativeFunction;

    // ToDo

}
