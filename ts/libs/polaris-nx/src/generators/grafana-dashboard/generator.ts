import { Tree, names } from '@nrwl/devkit';
import { Dashboard, Panels, Row, Target } from 'grafana-dash-gen';
import { GrafanaDashboardGeneratorNormalizedSchema, GrafanaDashboardGeneratorSchema } from './schema';


function normalizeOptions(host: Tree, options: GrafanaDashboardGeneratorSchema): GrafanaDashboardGeneratorNormalizedSchema {
    const normalizedName = names(options.name).name;
    const panelType = options.panelType || 'stat';
    const datasource = options.dashboard || 'default';
    const refresh = options.refresh || '5s';
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];
    const asRate = options.asRate || false;

    return {
        name: normalizedName,
        datasource,
        panelType,
        refresh,
        parsedTags,
        asRate,
        destDir: options.directory || './',
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

    const panel = createPanel('process_cpu_seconds_total', options.panelType, options.asRate, 'Process CPU seconds total');

    const dashboard = new Dashboard({
        title: `${options.name} Dashboard`,
        tags: options.parsedTags,
        refresh: options.refresh,
    });

    row.addPanel(panel);
    dashboard.addRow(row);

    const prometheusDashboard = sanitizeForPrometheus(dashboard, options.datasource).generate();
    return JSON.stringify(prometheusDashboard);
}

export default async function(host: Tree, options: GrafanaDashboardGeneratorSchema): Promise<void> {
    const normalizedOptions = normalizeOptions(host, options);

    const dashboard = generateDashboard(normalizedOptions);
    host.write(`${normalizedOptions.destDir}/${normalizedOptions.name}.json`, `${dashboard}`);

    return Promise.resolve();
}
