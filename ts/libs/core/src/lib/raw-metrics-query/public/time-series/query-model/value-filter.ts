
/**
 * Used to define the type of a comparison operation.
 */
// eslint-disable-next-line no-shadow
export enum ValueComparisonOperator {
    Equal,
    NotEqual,
    GreaterThan,
    LessThan,
    GreaterOrEqual,
    LessOrEqual,
    RegexMatch,
}

/**
 * The types that the `comparisonValue` of a `ValueFilter` may have.
 */
export type ValueFilterComparisonValueType = number | string | boolean;

/**
 * Describes a filter on `TimeSeries` values.
 *
 * Use the static methods of the `ValueFilters` class to instantiate filters.
 */
export interface ValueFilter {

    /**
     * The path within the value object that identifies the property to compare
     * or `undefined` if the value is a simple type.
     */
    propertyPath?: string;

    /**
     * The type of comparison operation.
     */
    operator: ValueComparisonOperator

    /**
     * The value to compare the value to.
     */
    comparisonValue: number | string | boolean;

}

/**
 * Used to create instances of `ValueFilter`.
 *
 * Each factory method has two variants:
 * - without a `propertyPath` for `TimeSeries` that have a simple value
 * - with a `propertyPath` for `TimeSeries` that have a complex (object) value.
 *
 * Example for `propertyPath`:
 * Suppose a `TimeSeries` has values of the following complex type:
 * ```
 * {
 *      x: number;
 *      y: number;
 *      origin: {
 *          id: number;
 *          name: string;
 *      };
 * }
 * ```
 * The `propertyPath` `origin.id` would reference the `id` property of the `origin` property of the value object.
 */
export class ValueFilters {

    /**
     * Creates a new filter, where the value must be equal to the `comparisonValue`.
     */
    static equal(comparisonValue: ValueFilterComparisonValueType): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must be equal to the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static equal(propertyPath: string, comparisonValue: ValueFilterComparisonValueType): ValueFilter;
    static equal(propertyPathOrValue: string | ValueFilterComparisonValueType, comparisonValue?: ValueFilterComparisonValueType): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.Equal, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must not be equal to the `comparisonValue`.
     */
    static notEqual(comparisonValue: ValueFilterComparisonValueType): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must not be equal to the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static notEqual(propertyPath: string, comparisonValue: ValueFilterComparisonValueType): ValueFilter;
    static notEqual(propertyPathOrValue: string | ValueFilterComparisonValueType, comparisonValue?: ValueFilterComparisonValueType): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.NotEqual, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must be greater than the `comparisonValue`.
     */
    static greaterThan(comparisonValue: number): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must be greater than the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static greaterThan(propertyPath: string, comparisonValue: number): ValueFilter;
    static greaterThan(propertyPathOrValue: string | number, comparisonValue?: number): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.GreaterThan, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must be greater than or equal to the `comparisonValue`.
     */
    static greaterOrEqual(comparisonValue: number): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must be greater than or equal to the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static greaterOrEqual(propertyPath: string, comparisonValue: number): ValueFilter;
    static greaterOrEqual(propertyPathOrValue: string | number, comparisonValue?: number): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.GreaterOrEqual, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must be less than the `comparisonValue`.
     */
    static lessThan(comparisonValue: number): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must be less than the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static lessThan(propertyPath: string, comparisonValue: number): ValueFilter;
    static lessThan(propertyPathOrValue: string | number, comparisonValue?: number): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.LessThan, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must be less than or equal to the `comparisonValue`.
     */
    static lessOrEqual(comparisonValue: number): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must be less than or equal to the `comparisonValue`.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static lessOrEqual(propertyPath: string, comparisonValue: number): ValueFilter;
    static lessOrEqual(propertyPathOrValue: string | number, comparisonValue?: number): ValueFilter {
        return this.buildFilter(ValueComparisonOperator.LessOrEqual, propertyPathOrValue, comparisonValue);
    }

    /**
     * Creates a new filter, where the value must match a regular expression.
     */
    static regex(regex: string | RegExp): ValueFilter;
    /**
     * Creates a new filter, where the value identified by `propertyPath` must match a regular expression.
     *
     * @param propertyPath The path of the property within the complex value object that should be compared.
     */
    static regex(propertyPath: string, regex: string | RegExp): ValueFilter;
    static regex(propertyPathOrValue: string | RegExp, regex?: string | RegExp): ValueFilter {
        let propertyPath: string;
        let regexStr: string;

        if (regex === undefined) {
            // No propertyPath was specified.
            propertyPath = undefined;
            regexStr = typeof propertyPathOrValue === 'string' ? propertyPathOrValue : propertyPathOrValue.source;
        } else {
            // A propertyPath was specified.
            propertyPath = propertyPathOrValue as string;
            regexStr = typeof regex === 'string' ? regex : regex.source;
        }

        return {
            propertyPath,
            operator: ValueComparisonOperator.RegexMatch,
            comparisonValue: regexStr,
        }
    }

    private static buildFilter(
        operator: ValueComparisonOperator,
        propertyPathOrValue: string | ValueFilterComparisonValueType,
        comparisonValue?: ValueFilterComparisonValueType,
    ): ValueFilter {
        let propertyPath: string;
        let value: ValueFilterComparisonValueType;

        if (comparisonValue === undefined) {
            // No propertyPath was specified.
            propertyPath = undefined;
            value = propertyPathOrValue;
        } else {
            // A propertyPath was specified.
            propertyPath = propertyPathOrValue as string;
            value = comparisonValue;
        }

        return {
            propertyPath,
            operator,
            comparisonValue: value,
        }
    }

}
