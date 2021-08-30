import { Tree } from '@nrwl/devkit';
import {
    getDashboard,
    readGrafanaBearerTokenFromKubernetes,
    readGrafanaUrlFromEnv, saveDashboard,
} from '../../util/grafana';
import { MetricsAlertGeneratorSchema, MetricsAlertGeneratorSchemaNormalized } from './schema';

async function normalizeOptions(host: Tree, options: MetricsAlertGeneratorSchema): Promise<MetricsAlertGeneratorSchemaNormalized> {
    console.log(options);
    const dashboardId = options.dashboardId;
    const panel = options.panel;
    const evaluateEvery = options.evaluateEvery || '1m';
    const forInterval = options.for || '5m';
    const when = options.when || 'avg';
    const of = options.of || ['A', '5m', 'now'];
    const threshold = options.threshold || 0.3;
    let grafanaUrl = options.grafanaUrl || '';
    let bearerToken = options.bearerToken || '';
    let toDisk = false;
    const destDir = options.directory || '';

    if (destDir !== '') {
        toDisk = true;

    } else {
        if (grafanaUrl === '') {
            grafanaUrl = readGrafanaUrlFromEnv();
        }
        console.log(`Grafana instance: ${grafanaUrl}`);
        if (bearerToken === '') {
            if (bearerToken === '') {
                bearerToken = await readGrafanaBearerTokenFromKubernetes();
            }
        }
    }

    return {
        name: dashboardId,
        dashboardId,
        panel,
        evaluateEvery,
        for: forInterval,
        when,
        of,
        threshold,
        grafanaUrl,
        bearerToken,
        toDisk,
        destDir,
    };

}

function createAlert(metricsAlert: MetricsAlertGeneratorSchemaNormalized): any {
    return {
        alertRuleTags: {},
        conditions: [
            {
                evaluator: {
                    params: [
                        metricsAlert.threshold,
                    ],
                    type: 'gt',
                },
                operator: {
                    type: 'and',
                },
                query: {
                    params: metricsAlert.of,
                },
                reducer: {
                    params: [],
                    type: metricsAlert.when,
                },
                type: 'query',
            },
        ],
        executionErrorState: 'alerting',
        for: metricsAlert.for,
        frequency: metricsAlert.evaluateEvery,
        handler: 1,
        name: `${metricsAlert.panel} alert`,
        noDataState: 'no_data',
        notifications: [],
    };
}


function thresholds(m: MetricsAlertGeneratorSchemaNormalized): any {
    return [
        {
            colorMode: 'critical',
            fill: true,
            line: true,
            op: 'gt',
            value: m.threshold,
        }];
}


function addAlert(dashboard: any, options: MetricsAlertGeneratorSchemaNormalized): any {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    for (const a of dashboard.panels) {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        if (a['title'] === options.panel) {
            a['alert'] = createAlert(options);
            a['thresholds'] = thresholds(options);
        }
    }
    return dashboard;
}

export default async function(host: Tree, options: MetricsAlertGeneratorSchema): Promise<void> {
    try {
        const normalizedOptions = await normalizeOptions(host, options);
        let dashboard = await getDashboard(normalizedOptions.dashboardId, normalizedOptions.grafanaUrl, normalizedOptions.bearerToken);
        dashboard = addAlert(dashboard, normalizedOptions);

        return saveDashboard(host, dashboard, normalizedOptions, true, options.dashboardId).catch(e => {
            console.error('Failed dashboard generation', e);
        });
    } catch (e) {
        console.error(e);
        return Promise.resolve();
    }
}
