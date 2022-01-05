# Polaris-CLI

## Metrics Dashboard Generation

The CLI provides means to generate metrics dashboards from scratch that display relevant metrics. In the current state,
a static metric is used but can be displayed in different panel types (i.e., gauge).
Further, the current implementation is configured to work with Grafana but we work on modularizing the internals to allow support for other implementations/dashboards. 

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

## Predicted Metric Controller

The CLI additionally allows to generate a component (Predicted Metric Controller) publishes predictions into the monitoring system.
The component consists of two programs that are scaffolded by the CLI and deployed in an atomic unit.

The first one is a _Composed Metric Controller_ that calls the second component, the _AI Proxy_ via REST to fetch the next prediction and transforms it into 
the selected _Composed Metric Type_.

The _AI Proxy_ queries raw data from the monitoring system, preprocesses it and calls an external AI service (i.e., [TF Serving](https://www.tensorflow.org/tfx/guide/serving)) and
returns the prediction.

The scaffolded code provides a basic implementation but leaves two main parts empty for custom logic:
1. In the _Composed Metric Controller_: the mapping of the AI prediction into the _Composed Metric Type_
2. In the _AI Proxy_:
   1. The metrics that should be fetched
   2. The preprocessing of the raw data into a format that is suitable for the deployed AI model

To generate a Predicted Metric Controller, the CLI offers the following parameters:
* `name` - the name of the controller
* `compMetricTypePkg` - the name of the npm package that contains the Composed Metric Type
* `compMetricType` - the name of the Composed Metric Type class
* `tags` - add tags to the project (used for linting) (**optional**)
* `directory` - a directory where the project is placed (**optional**)

 
