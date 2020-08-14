import { Observable } from 'rxjs';

import { DashboardSearchHit, SearchRequestOptions } from '../../../../common/model';
import { HttpRestClient } from '../../http';

export class SearchApi {

    constructor(
        private http: HttpRestClient,
    ) {}

    /**
     * Searches for dashboards and/or folders
     *
     * @see https://grafana.com/docs/grafana/latest/http_api/folder_dashboard_search/#search-folders-and-dashboards
     */
    search(options: SearchRequestOptions): Observable<DashboardSearchHit[]> {
        return this.http.get(`search`, options);
    }

}
