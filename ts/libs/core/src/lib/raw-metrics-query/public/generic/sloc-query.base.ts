import { Observable } from 'rxjs';
import { SlocQuery, SlocQueryResult } from '../generic';

/**
 * Common superclass that can be used for implementing `SlocQuery` realizations.
 *
 * Since SLOC queries are supposed to be used as a fluent API, `SlocQueryBase` is designed
 * to establish a chain of `SlocQuery` instances, with each query referring to its predecessor.
 */
export abstract class SlocQueryBase<T> implements SlocQuery<T> {

    /**
     * The query that precedes this one in the chain.
     *
     * If this is the first query in the chain, this value is `null`.
     */
    protected readonly predecessor: SlocQueryBase<T>;

    /**
     * Creates a new instance of `SlocBaseQuery`.
     *
     * @param predecessor The query that precedes this one in the chain. This should be `null`,
     * if this is the first query in the chain.
     */
    protected constructor(predecessor: SlocQueryBase<T>) {
        this.predecessor = predecessor;
    }

    execute(): Promise<SlocQueryResult<T>> {
        const chain = this.buildQueryChain();
        return this.executeInternal(chain);
    }

    toObservable(): Observable<SlocQueryResult<T>> {
        const chain = this.buildQueryChain();
        return this.toObservableInternal(chain);
    }

    /**
     * Executes the query and returns a promise that can be used to obtain the result.
     *
     * @param queryChain The entire query chain with the first element being the beginning of the chain
     * and the last element being the end of the chain (i.e., the query object on which `execute()` was called).
     * @returns A promise that resolves to the result of the query or rejects with an error.
     */
    protected abstract executeInternal(queryChain: SlocQueryBase<T>[]): Promise<SlocQueryResult<T>>;

    /**
     * Transforms the query into a cold observable, i.e., you must call `subscribe()`
     * on the observable to execute the query.
     *
     * If the underlying data store is a streaming engine, the observable may emit multiple times.
     *
     * @param queryChain The entire query chain with the first element being the beginning of the chain
     * and the last element being the end of the chain (i.e., the query object on which `toObservable()` was called).
     * @returns A cold observable for the query result.
     */
    protected abstract toObservableInternal(queryChain: SlocQueryBase<T>[]): Observable<SlocQueryResult<T>>;

    /**
     * Builds an array that represents the entire query chain.
     *
     * The first element is the beginning of the chain (e.g., the query that resulted from the `select()` call)
     * and the last element is the end of the chain (i.e., the query on which `execute()` or `toObservable()` was called).
     */
    protected buildQueryChain(): SlocQueryBase<T>[] {
        const chain = this.predecessor ? this.predecessor.buildQueryChain() : [];
        chain.push(this);
        return chain;
    }

}
