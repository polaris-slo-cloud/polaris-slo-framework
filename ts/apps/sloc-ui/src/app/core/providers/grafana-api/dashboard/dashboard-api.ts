import { Observable } from 'rxjs';

import { DashboardDTO } from '../../../../common/model';
import { HttpRestClient } from '../../http';

const DASHBOARDS_PREFIX = 'dashboards';

export class DashboardApi {

    constructor(
        private http: HttpRestClient,
    ) {}

    getDashboardByUid(uid: string): Observable<DashboardDTO> {
        return this.http.get(`${DASHBOARDS_PREFIX}/uid/${uid}`);
    }

}
