import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpService } from '../http';
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

    constructor(
        httpService: HttpService,
        @Inject(GRAFANA_BASE_URL) private grafanaBaseUrl: string,
    ) {
        const apiBaseUrl = `${grafanaBaseUrl}/api/`;
        const httpRestClient = httpService.createHttpRestClient(apiBaseUrl);

        this.dashboard = new DashboardApi(httpRestClient);
        this.search = new SearchApi(httpRestClient);
    }
}
