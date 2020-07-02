import { Inject, Injectable, InjectionToken } from '@angular/core';

import { CONFIG } from '../../../common/config/config';
import { HttpRestClient, HttpService } from '../http';
import { DashboardApi } from './dashboard/dashboard-api';
import { SearchApi } from './search/search-api';

/**
 * This injection token is used for determining the base URL of the Grafana API.
 */
export const GRAFANA_BASE_URL = new InjectionToken<string>('GRAFANA_API_BASE_URL');

/**
 * Provides access to the Grafana REST API.
 *
 * This service does not wrap all available REST API endpoints (https://grafana.com/docs/grafana/latest/http_api/),
 * but only a selection needed for the SLOC UI.
 */
@Injectable()
export class GrafanaApiService {

    readonly dashboard: DashboardApi;
    readonly search: SearchApi;

    private httpRestClient: HttpRestClient;

    constructor(
        httpService: HttpService,
        @Inject(GRAFANA_BASE_URL) private grafanaBaseUrl: string,
    ) {
        const apiBaseUrl = `${grafanaBaseUrl}/api/`;
        this.httpRestClient = httpService.createHttpRestClient(apiBaseUrl);
        this.setAuthToken();

        this.dashboard = new DashboardApi(this.httpRestClient);
        this.search = new SearchApi(this.httpRestClient);
    }

    // ToDo: replace this with a proper login or token loading and an immutable and observable state pattern to handle changing values.
    private setAuthToken(): void {
        const newHeaders = this.httpRestClient.httpHeaders.set('Authorization', `Bearer ${CONFIG.grafanaAuthToken}`);
        this.httpRestClient.httpHeaders = newHeaders;
    }

}
