# Polaris-CLI

## Grafana Dashboard Generation

The CLI provides means to generate Grafana dashboards from scratch that display relevant metrics. In the current state,
a static metric is used but can be displayed in different panel types (i.e., gauge).

Future versions of this feature will be able to extract relevant metrics from deployed SLOMappings.

### Usage

Dashboards can either be exported to a JSON file or uploaded directly to your Grafana Dashboard.

The following parameters can be used (but only `name` is mandatory, in which case the dashboard will be exported to a
file).

* `name`: name of the dashboard
* `panelType`: select the type of panel used for the (currently) static metric (available: graph, gauge, bargauge, table, stat)
* `directory`: dictates in which directory the file should be exported (relative to the working directory)
* `tags`: sets Grafana Dashboard tags
* `datasource`: The datasource to connect the dashboard with
* `refresh`: The refresh rate of the dashboard (i.e., 5s, 10s, 1m,...)
* `asRate`: Display the metric as rate with 5m
* `grafanaUrl`: Grafana base URL (i.e., http://localhost:3000)
* `bearerToken`: Bearer Token for Grafana API (must be Admin)

If either `grafanaUrl` or `bearerToken` are missing, the dashboard will be exported to `<name>.json`

Example usage (pushes dashboard to Grafana instance):

    npx nx g @polaris-sloc/polaris-nx:grafana-dashboard test-dash --panelType bargauge --tags test --refresh 10s --grafanaUrl http://localhost:3000 --bearerToken skfla...
    
