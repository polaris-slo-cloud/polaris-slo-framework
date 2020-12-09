import { QueryError } from '../../generic';
import { TimeSeriesQuery } from '../query-model';
import { NativeQueryBuilder } from './native-query-builder';
import { QueryContent, QueryContentType, SelectQueryContent } from './query-content';

/**
 * Common superclass for a `NativeQueryBuilder` implementation.
 *
 * Handles the building of a query chain and a separate chains by `QueryContentType`.
 */
export abstract class NativeQueryBuilderBase implements NativeQueryBuilder {

    /**
     * The first segment of the query is a select query.
     */
    protected selectSegment: SelectQueryContent;

    /**
     * The chain of query segments that come after the `selectSegment`.
     */
    protected queryChainAfterSelect: QueryContent[] = [];

    abstract buildQuery(): TimeSeriesQuery<any>;

    addQuery(queryContent: QueryContent): void {
        if (this.selectSegment) {
            // Not first query segment.
            if (queryContent.contentType === QueryContentType.Select) {
                throw new QueryError('Only the first query segment may be of `QueryContentType.Select`.', queryContent)
            }
            this.queryChainAfterSelect.push(queryContent);
        } else {
            // First query segment.
            if (queryContent.contentType === QueryContentType.Select) {
                throw new QueryError('The first query segment must be of `QueryContentType.Select`.', queryContent)
            }
            this.selectSegment = queryContent as SelectQueryContent;
        }
    }

}
