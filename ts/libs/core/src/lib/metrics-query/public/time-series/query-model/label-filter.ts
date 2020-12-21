
/**
 * Used to define the type of a comparison operation.
 */
// eslint-disable-next-line no-shadow
export enum LabelComparisonOperator {
    Equal,
    NotEqual,
    RegexMatch,
}

/**
 * Describes a filter on a `TimeSeries` label.
 *
 * Use the static methods of the `LabelFilters` class to instantiate filters.
 */
export interface LabelFilter {

    /**
     * The name of the label on which to filter.
     */
    label: string;

    /**
     * The type of comparison operation.
     */
    operator: LabelComparisonOperator

    /**
     * The value to compare the label to.
     */
    comparisonValue: string;

}

/**
 * Used to create instances of `LabelFilter`.
 */
export class LabelFilters {

    /**
     * Creates a new filter, where the `label`'s value must be equal to the `comparisonValue`.
     */
    static equal(label: string, comparisonValue: string): LabelFilter {
        return {
            label,
            operator: LabelComparisonOperator.Equal,
            comparisonValue,
        };
    }

    /**
     * Creates a new filter, where the `label`'s value must not be equal to the `comparisonValue`.
     */
    static notEqual(label: string, comparisonValue: string): LabelFilter {
        return {
            label,
            operator: LabelComparisonOperator.NotEqual,
            comparisonValue,
        };
    }

    /**
     * Creates a new filter, where the `label`'s value must match a regular expression.
     */
    static regex(label: string, regex: string | RegExp): LabelFilter {
        const regexStr = typeof regex === 'string' ? regex : regex.source;
        return {
            label,
            operator: LabelComparisonOperator.RegexMatch,
            comparisonValue: regexStr,
        };
    }

}
