# Polaris-CLI

## Metrics Dashboard Generation

The CLI provides means to generate metrics dashboards from scratch that display relevant metrics.
The CLI will scrape from the connected Kubernetes instance all SloMappings that correspond to the given Composed Metric Type and will
automatically create for each property an own panel.
Further, the current implementation is configured to work with Grafana but we work on modularizing the internals to allow support for other implementations/dashboards. 

### Usage

Dashboards can either be exported to a JSON file or uploaded directly to your Grafana Dashboard.

The following parameters can be used (but only `name` is mandatory, in which case the dashboard will be exported to a
file).

* `name`: name of the dashboard
* `compMetricType`: the name of the Composed Metric Type class
* `compMetricTypePkg`: the name of the npm package that contains the Composed Metric Type
* `namespace` The namespace in which the deployed SloMappings reside
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

    polaris-cli g metrics-dashboard test-dash 
    
## Metrics Alert Generation

The CLI also provides means to add alerts to the dashboard.
The current implementation targets the Grafana platform and therefore parameters orient towards this dashboard software.

The following parameters are available (`name`/`dashboardId`, and `panel` are mandatory - the defaults are taken from a default Grafana installation)

* `name`/`dashboardId`: the ID of the dashboard in which the panel resides
* `panel`: the name of the panel to which you want to add an alert
* `evaluateEvery`: Evaluation interval (default: 1m)
* `for`: Evaluation duration (default: `5m`)
  * `when`: Reducer function for metric (default: `avg`)
* `of`: Query (default: `['A', '5m', 'now']`)
* `threshold`: The threshold the metric is now allowed to surpass (default: `0.3`)
* `grafanaUrl`: Grafana base URL (i.e., http://localhost:3000)
    * default is read from following environment variables: `GRAFANA_URL` (default: `localhost`), `GRAFANA_PORT` (
      default: `3000`)
* `bearerToken`: Bearer Token for Grafana API (must be Admin)
    * default: pulled from Kubernetes' Secrets (`namespace: default`, `name: grafana`
      , `body: {"bearerToken": "secret_token"}`)
        * created with `kubectl create secret generic grafana --from-literal=bearerToken=secret_token`
* `directory`: dictates in which directory the file should be exported (relative to the working directory)
    * default: empty - optional

Example usage:

    polaris-cli g metrics-alert wPD1Cn4nz --panel='"Process CPU seconds total"'
