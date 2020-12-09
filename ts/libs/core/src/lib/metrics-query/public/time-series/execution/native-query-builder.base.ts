import { QueryError } from '../../generic';
import { TimeSeriesQuery } from '../query-model';
import { NativeQueryBuilder } from './native-query-builder';
import { QueryContent, QueryContentType, QueryContentTypeMapping, SelectQueryContent } from './query-content';

/**
 * Common superclass for a `NativeQueryBuilder` implementation.
 *
 * Handles the building of a query chain and a separate chains by `QueryContentType`.
 */
export abstract class NativeQueryBuilderBase implements NativeQueryBuilder {

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

    abstract buildQuery(): TimeSeriesQuery<any>;

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
