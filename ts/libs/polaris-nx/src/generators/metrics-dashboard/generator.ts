import {Tree, names} from '@nrwl/devkit';
import {SloMappingBase} from '@polaris-sloc/core';
import {Dashboard, Panels, Row, Target} from 'grafana-dash-gen';
import {
    getPanels,
    readGrafanaBearerTokenFromKubernetes,
    readGrafanaUrlFromEnv,
    saveDashboard,
} from '../../util/grafana';
import {PrometheusComposedMetric, createKubeConfig, listAllComposedMetrics} from '../../util/kubernetes';
import {GrafanaDashboardGeneratorNormalizedSchema, GrafanaDashboardGeneratorSchema} from './schema';


async function normalizeOptions(host: Tree, options: GrafanaDashboardGeneratorSchema): Promise<GrafanaDashboardGeneratorNormalizedSchema> {
    const normalizedName = names(options.name).name;
    const compMetricTypePkg = options.compMetricTypePkg;
    const compMetricType = options.compMetricType;
    const namespace = options.namespace;
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
            grafanaUrl = readGrafanaUrlFromEnv();
        }
        console.log(`Grafana instance: ${grafanaUrl}`);
        if (bearerToken === '') {
            bearerToken = await readGrafanaBearerTokenFromKubernetes();
        }
    }


    return {
        name: normalizedName,
        compMetricTypePkg,
        compMetricType,
        namespace,
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
    const panels = getPanels(dashboard);
    for (const panel of panels) {
        panel.datasource = datasource;
        for (let k = 0; k < panel.targets.length; k++) {
            const target = panel.targets[k];
            delete Object.assign(target, {['expr']: target['target']})['target'];
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


function generateDashboardForSlo(slo: SloMappingBase<any>, composedMetrics: PrometheusComposedMetric[],
                                 options: GrafanaDashboardGeneratorNormalizedSchema): string {
    const rows = [];
    /* eslint-disable @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-call */
    for (const composedMetric of composedMetrics) {
        for (const metricPropKey of composedMetric.metricPropKeys) {
            const row = new Row({
                title: metricPropKey,
            });
            const promQuery = `${composedMetric.timeSeriesName}{
                target_name="${composedMetric.targetName}",
                metric_prop_key="${metricPropKey}",
                target_gvk="${composedMetric.targetGvk}",
                target_namespace="${composedMetric.targetNamespace}"
            }`;
            const panel = createPanel(promQuery, options.panelType, options.asRate, metricPropKey);
            row.addPanel(panel);
            rows.push(row);
        }
    }


    const dashboard = new Dashboard({
        title: `${slo.metadata.name} Dashboard`,
        tags: options.parsedTags,
        refresh: options.refresh,
    });

    for (const row of rows) {
        dashboard.addRow(row);
    }

    return sanitizeForPrometheus(dashboard.generate(), options.datasource);
}

export default async function (host: Tree, options: GrafanaDashboardGeneratorSchema): Promise<void> {
    try {
        const normalizedOptions = await normalizeOptions(host, options);

        const composedMetricTypePkg = normalizedOptions.compMetricTypePkg;
        const composedMetricType = normalizedOptions.compMetricType;
        const requiredNamespace = normalizedOptions.namespace;
        const slosWithComposedMetrics: [SloMappingBase<any>, PrometheusComposedMetric[]][] = await listAllComposedMetrics(
            composedMetricTypePkg,
            composedMetricType,
            requiredNamespace,
            createKubeConfig(),
            host,
        );

        if (slosWithComposedMetrics.length === 0) {
            console.log('No dashboards created because there was no SLO.')
        }

        for (const t of slosWithComposedMetrics) {
            const slo = t[0];
            const composedMetric = t[1];
            const dashboard = generateDashboardForSlo(slo, composedMetric, normalizedOptions);
            try {
                await saveDashboard(host, dashboard, normalizedOptions);
                console.log(`Dashboard created for SLO ${slo.metadata.name}`)
            } catch (e) {
                console.error('Failed dashboard generation');
            }
        }

    } catch (e) {
        console.error('Failed dashboard generation');
        console.error(e);
        return Promise.resolve();
    }
}
