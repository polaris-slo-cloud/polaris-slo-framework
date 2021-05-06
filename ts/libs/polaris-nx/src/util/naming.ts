
/**
 * Represents a set of commonly used forms of the same name, as returned by the `name()` function of `@nrwl/devkit`.
 */
export interface NormalizedNames {

    /**
     * The name given as input.
     */
    name: string;

    /**
     * @example 'MyName'
     */
    className: string;

    /**
     * @example 'myName'
     */
    propertyName: string;

    /**
     * @example 'MY_NAME'
     */
    constantName: string;

    /**
     * @example 'my-name'
     */
    fileName: string;
}

