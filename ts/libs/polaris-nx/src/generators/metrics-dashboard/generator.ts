import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';
import { Tree, names } from '@nrwl/devkit';
import axios from 'axios';
import { Dashboard, Panels, Row, Target } from 'grafana-dash-gen';
import {
    GrafanaDashboardDbError,
    GrafanaDashboardDbResponse,
    GrafanaDashboardGeneratorNormalizedSchema,
    GrafanaDashboardGeneratorSchema,
} from './schema';

async function readBearerToken(kubeConfig: KubeConfig): Promise<string> {
    const client = kubeConfig.makeApiClient(CoreV1Api);
    const secret = await client.readNamespacedSecret('grafana', 'default');
    const bearerToken = secret.body.data['bearerToken'];
    return Buffer.from(bearerToken, 'base64').toString('binary');
}

async function normalizeOptions(host: Tree, options: GrafanaDashboardGeneratorSchema): Promise<GrafanaDashboardGeneratorNormalizedSchema> {
    const normalizedName = names(options.name).name;
    const panelType = options.panelType || 'graph';
    const datasource = options.dashboard || 'default';
    const refresh = options.refresh || '5s';
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    const asRate = options.asRate || false;
    let grafanaUrl = options.grafanaUrl || '';
    let bearerToken = options.bearerToken || '';
    let toDisk = false;
    const destDir = options.directory || '';

    if (destDir !== '') {
        toDisk = true;
    } else {
        if (grafanaUrl === '') {
            const grafanaHost = process.env['GRAFANA_HOST'] || 'localhost';
            const grafanaPort = process.env['GRAFANA_PORT'] || 3000;
            grafanaUrl = `http://${grafanaHost}:${grafanaPort}`;
        }
        console.log(`Grafana instance: ${grafanaUrl}`);
        if (bearerToken === '') {
            try {
                const kubeConfig = new KubeConfig();
                kubeConfig.loadFromDefault();
                if (bearerToken === '') {
                    bearerToken = await readBearerToken(kubeConfig);
                }
            } catch (e) {
                throw new Error('Failed to connect to kubeconfig - can not read Bearertoken.');
            }

        }
    }


    return {
        name: normalizedName,
        datasource,
        panelType,
        refresh,
        parsedTags,
        asRate,
        grafanaUrl,
        bearerToken,
        toDisk,
        destDir,
    };
}

/**
 * Prepares the dashboard generated from grafana-dash-gen to be compatible with Prometheus.
 * The problem with grafana-dash-gen is that it is written against Graphite and can't be configured.
 * Following steps are necessary:
 * 1. Assign a datasource (default) to each panel. ('Prometheus' will also work in case multiple datasources exist)
 * 2. Change the key 'target' in each panel to 'expr' - 'target' is used by Graphite
 *
 * @param dashboard the original Dashboard (i.e., prepared for Graphite)
 * @param datasource the datasource to connect the dashboard with
 */
function sanitizeForPrometheus(dashboard: typeof Dashboard, datasource: string): typeof Dashboard {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    /* eslint-disable @typescript-eslint/prefer-for-of */
    // During development the use of a for-of loop did not work (i.e., the variable always got the index assigned)
    for (let i = 0; i < dashboard.rows.length; i++) {
        const row = dashboard.rows[i];
        row.datasource = datasource;
        for (let j = 0; j < row.panels.length; j++) {
            const panel = row.panels[j];
            panel.datasource = datasource;
            for (let k = 0; k < panel.targets.length; k++) {
                const target = panel.targets[k];
                delete Object.assign(target, { ['expr']: target['target'] })['target'];
            }
        }
    }
    return dashboard;
}

/**
 * Create a single element panel.
 * Currently supported panel types: graph, table, stat, gauge, bargauge
 *
 * @param metric the prometheus metric, supports raw prometheus queries
 * @param type panel type to use
 * @param asRate display the metric as rate
 * @param title optional title for the panel, defaults to the metric
 */
function createPanel(metric: string, type: string, asRate: boolean, title?: string): typeof Panels {
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */

    if (asRate) {
        metric = `rate(${metric}[5m])`;
    }

    if (type === 'graph') {
        return new Panels.Graph({
            title: title || metric,
            span: 4,
            targets: [
                new Target(metric),
            ],
        });
    }

    if (type === 'table') {
        return new Panels.Table({
            title: title || metric,
            span: 4,
            targets: [
                new Target(metric),
            ],
        });
    }

    if (type === 'stat' || type === 'bargauge' || type === 'gauge') {
        const panel = new Panels.SingleStat({
            title: title || metric,
            span: 4,
            targets: [
                new Target(metric),
            ],
        });
        panel.state.type = type;
        return panel;
    }

    // TODO handle unknown panel type
    return new Panels.SingleStat({
        title: 'Unknown panel',
        span: 4,
        targets: [
            new Target('unknown'),
        ],
    });

}

function generateDashboard(options: GrafanaDashboardGeneratorNormalizedSchema): string {

    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
    const row = new Row({
        title: 'Basic Metrics',
    });

    const panel = createPanel('instance:node_load1_per_cpu:ratio', options.panelType, options.asRate, 'Process CPU seconds total');

    const dashboard = new Dashboard({
        title: `${options.name} Dashboard`,
        tags: options.parsedTags,
        refresh: options.refresh,
    });

    row.addPanel(panel);
    dashboard.addRow(row);

    return sanitizeForPrometheus(dashboard.generate(), options.datasource);
}

/**
 * Calls the Grafana REST API and creates a new dashboard
 *
 * @param dashboard
 * @param options
 */
function createDashboardApi(dashboard: string, options: GrafanaDashboardGeneratorNormalizedSchema): Promise<void> {
    const body = {
        dashboard,
        folderId: 0,
        message: `Create dashboard ${options.name}`,
        overwrite: false,
    };
    const config = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        headers: { Authorization: `Bearer ${options.bearerToken}` },
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

/**
 * Depending on the given options, will write the dashboard either to disk or POST it to the specified Grafana API
 * For more info on the REST API: https://grafana.com/docs/grafana/latest/http_api/dashboard/
 *
 * @param host used in case the dashboard should be written to disk
 * @param dashboard the dashboard as JSON
 * @param options specifies mode of operation (to, and contains API Bearer token and URL
 */
function saveDashboard(host: Tree, dashboard: typeof Dashboard, options: GrafanaDashboardGeneratorNormalizedSchema): Promise<void> {
    if (options.toDisk) {
        const stringified = JSON.stringify(dashboard);
        const filePath = `${options.destDir}/${options.name}.json`;
        console.log(`Write grafana dashboard to ${filePath}`);
        host.write(filePath, `${stringified}`);
        return Promise.resolve();
    } else {
        return createDashboardApi(dashboard, options);
    }
}

export default async function(host: Tree, options: GrafanaDashboardGeneratorSchema): Promise<void> {
    try {
        const normalizedOptions = await normalizeOptions(host, options);
        const dashboard = generateDashboard(normalizedOptions);

        return saveDashboard(host, dashboard, normalizedOptions).catch(e => {
            console.error('Failed dashboard generation', e);
        });
    } catch (e) {
        console.error(e)
        return Promise.resolve();
    }
}
