import { QueryContent } from './query-content';

/**
 * Used to assemble the DB specific query of type `Q`.
 */
export interface TimeSeriesQueryBuilder<Q> {

    /**
     * Adds the specified `queryContent` as a new segment to this builder's query.
     */
    addQuery(queryContent: QueryContent): void;

    /**
     * Builds the query for the DB, for which this builder is implemented.
     *
     * @return A DB specific query object.
     */
    buildQuery(): Q;

}
