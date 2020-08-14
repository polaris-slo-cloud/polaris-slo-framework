
/**
 * This file contains interfaces for Grafana REST API requests, which are not provided by @grafana/data.
 * Many of the descriptions are copied from the respective documentation pages under https://grafana.com/docs/grafana/latest/http_api/
 */

import { DashboardSearchItemType } from './vendor';

/**
 * Possible query parameters for a search request.
 *
 * @see https://grafana.com/docs/grafana/latest/http_api/folder_dashboard_search/#search-folders-and-dashboards
 */
export interface SearchRequestOptions {

    /** Search Query. */
    query?: string;

    /** List of tags to search for. */
    tag?: string[];

    /** Type to search for. */
    type: DashboardSearchItemType.DashFolder | DashboardSearchItemType.DashDB;

    /** List of dashboard IDs to search for. */
    dashboardIds?: number[];

    /** List of folder id’s to search in for dashboards. */
    folderIds?: number[];

    /** Flag indicating if only starred Dashboards should be returned. */
    starred?: boolean;

    /** Limit the number of returned results (max 5000). */
    limit?: number;

    /**
     * Use this parameter to access hits beyond limit.
     *
     * Numbering starts at 1. `limit` param acts as page size.
     */
    page?: number;

}
