import { NativeQueryBuilder } from './native-query-builder';
import { SubqueryQueryContent } from './query-content';

/**
 * Adds a `subqueryBuilders` property to a `QueryContent` with subqueries.
 */
 export type SubqueryBuilderContainer<T extends SubqueryQueryContent> = T & {

    /**
     * Contains the `NativeQueryBuilder` for each query in `subqueries`.
     *
     * When using this inside a `NativeQueryBuilder` realization, it is safe to assume that the
     * subquery builders are of the same `NativeQueryBuilder` realization.
     */
    subqueryBuilders: NativeQueryBuilder[];

};
