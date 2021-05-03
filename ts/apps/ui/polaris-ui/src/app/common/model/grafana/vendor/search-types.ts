/* eslint-disable no-shadow */
/**
 * This file is a modified version of the file `public/app/features/search/types.ts` from
 * the Grafana source code, which is licensed under the Apache 2.0 license and is available at
 * https://github.com/grafana/grafana
 */

import { SelectableValue } from '@grafana/data';
import { FolderInfo } from './folder';

export enum DashboardSearchItemType {
    DashDB = 'dash-db',
    DashHome = 'dash-home',
    DashFolder = 'dash-folder',
}

export interface DashboardSection {
    id: number;
    uid?: string;
    title: string;
    expanded?: boolean;
    url: string;
    icon?: string;
    score?: number;
    checked?: boolean;
    items: DashboardSectionItem[];
    toggle?: (section: DashboardSection) => Promise<DashboardSection>;
    selected?: boolean;
    type: DashboardSearchItemType;
    slug?: string;
    itemsFetching?: boolean;
}

export interface DashboardSectionItem {
    checked?: boolean;
    folderId?: number;
    folderTitle?: string;
    folderUid?: string;
    folderUrl?: string;
    id: number;
    isStarred: boolean;
    selected?: boolean;
    tags: string[];
    title: string;
    type: DashboardSearchItemType;
    uid?: string;
    uri: string;
    url: string;
}

/**
 * Represents a single item in the results of a search executed using `GrafanaApi.search.search()`.
 *
 * Note that despite the name of the interface, the `type` field may also be set to `DashboardSearchItemType.DashFolder`.
 */
export interface DashboardSearchHit extends DashboardSectionItem, DashboardSection { }

export interface DashboardTag {
    term: string;
    count: number;
}

export interface OpenSearchParams {
    query?: string;
}

export interface UidsToDelete {
    folders: string[];
    dashboards: string[];
}

export interface DashboardQuery {
    query: string;
    tag: string[];
    starred: boolean;
    skipRecent: boolean;
    skipStarred: boolean;
    folderIds: number[];
    sort: SelectableValue | null;
    layout: SearchLayout;
}

export type OnToggleChecked = (item: DashboardSectionItem | DashboardSection) => void;
export type OnDeleteItems = (folders: string[], dashboards: string[]) => void;
export type OnMoveItems = (selectedDashboards: DashboardSectionItem[], folder: FolderInfo | null) => void;

export enum SearchLayout {
    List = 'list',
    Folders = 'folders',
}

export interface RouteParams {
    query?: string | null;
    sort?: string | null;
    starred?: boolean | null;
    tag?: string[] | null;
    layout?: SearchLayout | null;
}
