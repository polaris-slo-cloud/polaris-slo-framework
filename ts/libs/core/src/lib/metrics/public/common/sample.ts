
/**
 * Represents a single observed metric value.
 */
export interface Sample<T> {

    /** The Unix timestamp when this sample was taken. */
    timestamp: number;

    /** The value of this sample. */
    value: T;

}
