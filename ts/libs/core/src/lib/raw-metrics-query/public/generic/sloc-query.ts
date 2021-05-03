import { Observable } from 'rxjs';

/**
 * Encapsulates the result of a `PolarisQuery`.
 */
export interface PolarisQueryResult<T> {

    /**
     * The array of results of the successful execution of the query.
     *
     * If no items match the query, this will be an empty array.
     */
    results: T[];

}

/**
 * Represents a metrics query in SLOC.
 *
 * A realization of this interface should be immutable to allow query objects to be reused
 * in multiple places.
 */
export interface PolarisQuery<T> {

    /**
     * Executes the query and returns a promise that can be used to obtain the result.
     *
     * @returns A promise that resolves to the result of the query or rejects with an error.
     */
    execute(): Promise<PolarisQueryResult<T>>;

    /**
     * Transforms the query into a cold observable, i.e., you must call `subscribe()`
     * on the observable to execute the query.
     *
     * If the underlying data store is a streaming engine, the observable may emit multiple times.
     *
     * @returns A cold observable for the query result.
     */
    toObservable(): Observable<PolarisQueryResult<T>>;

}
