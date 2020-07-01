import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { DashboardSearchHit, DashboardSearchItemType, SearchRequestOptions } from '../../../../common/model';
import { GrafanaApiService } from '../../grafana-api';

/**
 * Used for Dashboard operations on Grafana
 */
@Injectable()
export class DashboardOperations {

    constructor(
        private grafana: GrafanaApiService,
    ) {}

    searchDashboards(query: Exclude<SearchRequestOptions, 'type'>): Observable<DashboardSearchHit[]> {
        return this.grafana.search.search({ ...query, type: DashboardSearchItemType.DashDB });
    }

}
