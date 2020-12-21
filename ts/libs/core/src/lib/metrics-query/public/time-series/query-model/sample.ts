
/**
 * Represents a single observed metric value.
 */
export interface Sample<T> {

    /** The Unix timestamp in milliseconds precision when this sample was taken. */
    timestamp: number;

    /** The value of this sample. */
    value: T;

}
