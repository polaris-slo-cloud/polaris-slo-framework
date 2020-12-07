import { Observable } from 'rxjs';

/**
 * Encapsulates the result of a `SlocQuery`.
 */
export interface SlocQueryResult<T> {

    /**
     * The array of results of the successful execution of the query.
     *
     * If no items match the query, this will be an empty array.
     */
    results: T[];

}

/**
 * Represents a metrics query in SLOC.
 */
export interface SlocQuery<T> {

    /**
     * Executes the query and returns a promise that can be used to obtain the result.
     *
     * @returns A promise that resolves to the result of the query or rejects with an error.
     */
    execute(): Promise<SlocQueryResult<T>>;

    /**
     * Transforms the query into a cold observable, i.e., you must call `subscribe()`
     * on the observable to execute the query.
     *
     * If the underlying data store is a streaming engine, the observable may emit multiple times.
     *
     * @returns A cold observable for the query result.
     */
    toObservable(): Observable<SlocQueryResult<T>>;

}
