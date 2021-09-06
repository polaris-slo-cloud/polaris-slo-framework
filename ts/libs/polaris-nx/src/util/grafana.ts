import {Tree} from '@nrwl/devkit';
import axios, {AxiosResponse} from 'axios';
import {Dashboard, Panel} from 'grafana-dash-gen';
import {createKubeConfig, readKubernetesSecret} from './kubernetes';

export function readGrafanaUrlFromEnv(): string {
    const grafanaHost = process.env['GRAFANA_HOST'] || 'localhost';
    const grafanaPort = process.env['GRAFANA_PORT'] || 3000;
    return `http://${grafanaHost}:${grafanaPort}`;
}

export async function readGrafanaBearerTokenFromKubernetes(): Promise<string> {
    try {
        const kubeConfig = createKubeConfig();
        return await readKubernetesSecret(kubeConfig, 'grafana', 'default', 'bearerToken');
    } catch (e) {
        throw new Error('Failed to connect to kubeconfig - can not read Bearertoken.');
    }
}

export function getPanels(dashboard: typeof Dashboard): typeof Panel[] {
    const panels: typeof Panel = [];
    if ('panels' in dashboard) {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable @typescript-eslint/prefer-for-of */
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        for (let i = 0; i < dashboard.panels.length; i++) {
            const panel = dashboard.panels[i];
            panels.push(panel);
        }
    }

    if ('rows' in dashboard) {
        for (let i = 0; i < dashboard.rows.length; i++) {
            const row = dashboard.rows[i];
            for (let j = 0; j < row.panels.length; j++) {
                const panel = row.panels[j];
                panels.push(panel);
            }
        }
    }

    return panels
}


/**
 * Calls the Grafana REST API and creates a new dashboard
 *
 * @param dashboard
 * @param options
 * @param overwrite
 * @param folderUid
 */
export function createDashboardApi(options: { name: string, bearerToken: string, grafanaUrl: string },
                                   dashboard: string, overwrite?: boolean, folderUid?: string): Promise<void> {
    const body = {
        dashboard,
        folderId: 0,
        message: `Create dashboard ${options.name}`,
        overwrite: overwrite || false,
        folderUid: folderUid || '',
    };
    const config = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: {Authorization: `Bearer ${options.bearerToken}`},
        // in ms
        timeout: 5000,
    };
    const url = `${options.grafanaUrl}/api/dashboards/db`;
    return axios.post<GrafanaDashboardDbResponse>(url, body, config).then(response => {
        const data: GrafanaDashboardDbResponse = response.data;
        console.log(`Dashboard created successfully: ${options.grafanaUrl}${data.url}`);
    }).catch((error: GrafanaDashboardDbError) => {
        const message = error.response.data.message;
        const status = error.response.data.status;
        console.error(`Creating dashboard failed: Status: ${status} - Message: ${message}`);
    });
}

export async function getDashboard(dashboardId: string, grafanaUrl: string, bearerToken: string): Promise<string> {
    const url = `${grafanaUrl}/api/dashboards/uid/${dashboardId}`;
    const config = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: {Authorization: `Bearer ${bearerToken}`},
        // in ms
        timeout: 5000,
    };
    const response: AxiosResponse = await axios.get(url, config);
    if (response.status !== 200) {
        throw new Error(`Can't find dashboard with id ${dashboardId}`);
    }
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return response.data.dashboard;
}

/**
 * Depending on the given options, will write the dashboard either to disk or POST it to the specified Grafana API
 * For more info on the REST API: https://grafana.com/docs/grafana/latest/http_api/dashboard/
 *
 * @param host used in case the dashboard should be written to disk
 * @param dashboard the dashboard as JSON
 * @param options specifies mode of operation (to, and contains API Bearer token and URL
 * @param overwrite
 * @param folderUid
 */
export function saveDashboard(host: Tree, dashboard: typeof Dashboard,
                              options: { destDir: string, toDisk: boolean, name: string, bearerToken: string, grafanaUrl: string }
    , overwrite?: boolean, folderUid?: string): Promise<void> {
    if (options.toDisk) {
        const stringified = JSON.stringify(dashboard);
        const filePath = `${options.destDir}/${options.name}.json`;
        console.log(`Write grafana dashboard to ${filePath}`);
        host.write(filePath, `${stringified}`);
        return Promise.resolve();
    } else {
        return createDashboardApi(options, dashboard, overwrite, folderUid);
    }
}

/**
 * Types to store the response of /api/dashboards/db
 * See: https://grafana.com/docs/grafana/latest/http_api/dashboard/#create--update-dashboard
 */
export interface GrafanaDashboardDbResponse {
    id: number;
    slug: string;
    status: string;
    uid: string;
    url: string;
    version: string;
}

export interface GrafanaDashboardDbError {
    response: {
        // HTTP code
        status: number;
        statusText: string;
        data: {
            message: string;
            status: string;
        }
    };
}

