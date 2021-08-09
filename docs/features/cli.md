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
* `panelType`: select the type of panel used for the (currently) static metric (available: `graph`, `gauge`, `bargauge`
  , `table`, `stat`)
    * default: `stat`
* `directory`: dictates in which directory the file should be exported (relative to the working directory)
    * default: empty - optional
* `tags`: sets Grafana Dashboard tags
    * default: none
* `datasource`: The datasource to connect the dashboard with
    * default: `default`
* `refresh`: The refresh rate of the dashboard (i.e., 5s, 10s, 1m,...)
    * default: `5s`
* `asRate`: Display the metric as rate with 5m
    * default: `false`
* `grafanaUrl`: Grafana base URL (i.e., http://localhost:3000)
    * default is read from following environment variables: `GRAFANA_URL` (default: `localhost`), `GRAFANA_PORT` (
      default: `3000`)
* `bearerToken`: Bearer Token for Grafana API (must be Admin)
    * default: pulled from Kubernetes' Secrets (`namespace: default`, `name: grafana`
      , `body: {"bearerToken": "secret_token"}`)
        * created with `kubectl create secret generic grafana --from-literal=bearerToken=secret_token`

Dhe dashboard will be exported to `<name>.json`, in case `directory` is set.

Example usage (pushes dashboard to Grafana instance):

    polaris-cli g grafana-dashboard test-dash 
    
