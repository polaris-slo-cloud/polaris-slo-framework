import { Observable } from 'rxjs';

import { DashboardSearchHit, SearchRequestOptions } from '../../../../common/model';
import { HttpService } from '../../http';

export class SearchApi {

    constructor(
        private http: HttpService,
        private apiBaseUrl: string,
    ) {}

    /**
     * Searches for dashboards and/or folders
     *
     * @see https://grafana.com/docs/grafana/latest/http_api/folder_dashboard_search/#search-folders-and-dashboards
     */
    search(options: SearchRequestOptions): Observable<DashboardSearchHit[]> {
        return this.http.get(`${this.apiBaseUrl}/search`, options);
    }

}
