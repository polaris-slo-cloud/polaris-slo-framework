import { QueryError } from '../../generic';
import { QueryContent, QueryContentType, QueryContentTypeMapping, SelectQueryContent } from './query-content';
import { TimeSeriesQueryBuilder } from './time-series-query-builder';

/**
 * Common superclass for a `TimeSeriesQueryBuilder` implementation.
 *
 * Handles the building of a query chain and a separate chains by `QueryContentType`.
 */
export abstract class TimeSeriesQueryBuilderBase<Q> implements TimeSeriesQueryBuilder<Q> {

    /**
     * The query chain that has been assembled through `addQuery()` calls.
     */
    protected queryChain: QueryContent[] = [];

    protected selectSegment: SelectQueryContent;

    protected segmentsByType: { [K in Exclude<QueryContentType, QueryContentType.Select>]: QueryContentTypeMapping[K][]; } = {
        filterOnLabel: [],
        filterOnValue: [],
        function: [],
        nonNativeFunction: [],
    };

    abstract buildQuery(): Q;

    addQuery(queryContent: QueryContent): void {
        if (this.queryChain.length > 0) {
            // Not first query segment.
            if (queryContent.contentType === QueryContentType.Select) {
                throw new QueryError('Only first query segment may be of `QueryContentType.Select`.', queryContent)
            }

            const segmentTypeChain = this.segmentsByType[queryContent.contentType];
            if (!segmentTypeChain) {
                throw new QueryError(`Unknown QueryContentType: ${queryContent.contentType}`, queryContent);
            }

            segmentTypeChain.push(queryContent);
        } else {
            // First query segment.
            if (queryContent.contentType === QueryContentType.Select) {
                throw new QueryError('The first query segment must be of `QueryContentType.Select`.', queryContent)
            }
            this.selectSegment = queryContent as SelectQueryContent;
        }

        this.queryChain.push(queryContent);
    }

}
