/**
 * This file is a modified version of the file `public/app/types/folder.ts` from
 * the Grafana source code, which is licensed under the Apache 2.0 license and is available at
 * https://github.com/grafana/grafana
 */

import { DashboardAcl } from './acl';

export interface FolderDTO {
    id: number;
    uid: string;
    title: string;
    url: string;
    version: number;
    canSave: boolean;
    canEdit: boolean;
    canAdmin: boolean;
}

export interface FolderState {
    id: number;
    uid: string;
    title: string;
    url: string;
    canSave: boolean;
    hasChanged: boolean;
    version: number;
    permissions: DashboardAcl[];
}

export interface FolderInfo {
    id: number;
    title: string;
    url: string;
}
