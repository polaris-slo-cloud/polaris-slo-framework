/* eslint-disable no-shadow */
/**
 * This file is a modified version of the file `public/app/types/dashboard.ts` from
 * the Grafana source code, which is licensed under the Apache 2.0 license and is available at
 * https://github.com/grafana/grafana
 */

import { DataQuery } from '@grafana/data';
import { Panel } from './panel';
import { DashboardSectionItem } from './search-types';

export interface DashboardDTO {
    redirectUri?: string;
    dashboard: DashboardDataDTO;
    meta: DashboardMeta;
}

export interface DashboardMeta {
    canSave?: boolean;
    canEdit?: boolean;
    canDelete?: boolean;
    canShare?: boolean;
    canStar?: boolean;
    canAdmin?: boolean;
    url?: string;
    folderId?: number;
    fromExplore?: boolean;
    canMakeEditable?: boolean;
    submenuEnabled?: boolean;
    provisioned?: boolean;
    provisionedExternalId?: string;
    focusPanelId?: number;
    isStarred?: boolean;
    showSettings?: boolean;
    expires?: string;
    isSnapshot?: boolean;
    folderTitle?: string;
    folderUrl?: string;
    created?: string;
    createdBy?: string;
    updated?: string;
    updatedBy?: string;
}

export interface DashboardDataDTO extends DashboardSectionItem {
    title: string;
    panels: Panel[];
}

export enum DashboardRouteInfo {
    Home = 'home-dashboard',
    New = 'new-dashboard',
    Normal = 'normal-dashboard',
    Scripted = 'scripted-dashboard',
}

export enum DashboardInitPhase {
    NotStarted = 'Not started',
    Fetching = 'Fetching',
    Services = 'Services',
    Failed = 'Failed',
    Completed = 'Completed',
}

export interface DashboardInitError {
    message: string;
    error: any;
}

export const KIOSK_MODE_TV = 'tv';
export type KioskUrlValue = 'tv' | '1' | true;

export interface QueriesToUpdateOnDashboardLoad {
    panelId: number;
    queries: DataQuery[];
}
