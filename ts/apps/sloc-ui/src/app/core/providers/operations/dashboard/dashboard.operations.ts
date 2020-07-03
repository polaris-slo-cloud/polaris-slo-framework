import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardDTO, DashboardSearchHit, DashboardSearchItemType, SearchRequestOptions } from '../../../../common/model';
import { GrafanaApiService } from '../../grafana-api';

/**
 * Used for Dashboard operations on Grafana
 *
 * ToDo: Implement error handling, possible state updates, etc.
 * Loading state should only be updated in a component.
 */
@Injectable()
export class DashboardOperations {

    constructor(
        private grafana: GrafanaApiService,
    ) {}

    searchDashboards(query: Omit<SearchRequestOptions, 'type'>): Observable<DashboardSearchHit[]> {
        return this.grafana.search.search({ ...query, type: DashboardSearchItemType.DashDB });
    }

    getDashboardByUid(uid: string): Observable<DashboardDTO> {
        return this.grafana.dashboard.getDashboardByUid(uid);
    }

}
