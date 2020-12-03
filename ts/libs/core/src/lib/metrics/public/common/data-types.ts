/* eslint-disable id-blacklist */

/**
 * Defines the names of the data types that a sample may have.
 */
// eslint-disable-next-line no-shadow
export enum DataType {

    /** A 64-bit signed integer. */
    Integer = 'int',

    /** An IEEE-754 64-bit floating-point number. */
    Float = 'float',

    /** A unicode string. */
    String = 'string',

    /** A complex data structure. */
    Object = 'object',

}

/**
 * Index type for mapping the members of the `DataType` enum the TypeScript types
 * used to represent them.
 *
 * @example
 * ```
 * export interface TimeSeries<D extends DataType = DataType, T = DataTypeMappings[D]> { ... }
 * ```
 */
export interface DataTypeMappings {
    int: number;
    float: number;
    string: string;
    object: any;
}
