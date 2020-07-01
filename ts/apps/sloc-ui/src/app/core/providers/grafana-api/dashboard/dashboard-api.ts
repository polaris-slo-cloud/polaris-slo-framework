import { Observable } from 'rxjs';

import { DashboardDTO } from '../../../../common/model';
import { HttpService } from '../../http';

export class DashboardApi {

    private readonly dashboardsApiUrl: string;

    constructor(
        private http: HttpService,
        private apiBaseUrl: string,
    ) {
        this.dashboardsApiUrl = apiBaseUrl + '/dashboards';
    }

    getDashboardByUid(uid: string): Observable<DashboardDTO> {
        return this.http.get(`${this.dashboardsApiUrl}/uid/${uid}`);
    }

}
