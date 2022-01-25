# Polaris-CLI

The Polaris CLI is implemented as a plugin for the [Nx CLI](https://nx.dev), which is exposed through a Polaris-specific wrapper application.
To install the Polaris CLI execute the following command:

```sh
npm install -g @polaris-sloc/cli
```

Now, the Polaris CLI is available globally, as `polaris-cli`.


## Commands Overview

The Polaris CLI supports the following commands:

| Command                              | Purpose                                 |
|--------------------------------------|-----------------------------------------|
| `polaris-cli init <name>`            | Creates a new Nx workspace for creating Polaris projects.|
| `polaris-cli generate <type> <name>` | Generates a new Polaris project/component [alias: `g`]|
| `polaris-cli build <name>`           | Builds a Polaris project. |
| `polaris-cli docker-build <name>`    | Builds the Docker container image for a Polaris controller project. |
| `polaris-cli deploy <name>`          | Deploys a Polaris project or an SLO Mapping to an orchestrator. |
| `polaris-cli generate-crds <project>`| Generates a Custom Resource Definition (CRD) for an existing Polaris ApiObject type. [alias: `gen-crds`] |


## Create a New Workspace

1. Open a terminal at the location, where you would like to create your new workspace.
1. Create the workspace:
    ```sh
    polaris-cli init <workspace-name>
    ```

## Generate a Component

The `polaris-cli generate <type> <name>` command allows generating new polaris components.
If supports the following types:

* [`slo-mapping-type`](#slo-mapping-type)
* [`slo-controller`](#slo-controller)
* [`elasticity-strategy`](#elasticity-strategy)
* [`elasticity-strategy-controller`](#elasticity-strategy-controller)
* [`composed-metric-type`](#composed-metric-type)
* [`composed-metric-controller`](#composed-metrics-controller)
* [`metrics-dashboard`](#metrics-dashboard-generation)
* [`metrics-alert`](#metrics-alert-generation)
* [`predicted-metric-controller`](#predicted-metric-controller)


### SLO Mapping Type

To generate a new SLO Mapping, use the following command:

```sh
polaris-cli g slo-mapping-type <name> --project=<dest-project> --createLibProject=<true|false> --importPath=<npm-package-name-of-dest-project>
```

**Parameters:**
* `name`: Name of the SLO Mapping type. 'SloMapping' will be appended automatically. E.g., `CostEfficiency`.
* `project`: The name of the publishable library project, to which the SLO Mapping type should be added. E.g., `my-lib`.
* `createLibProject`: (optional) Create a publishable library project for the SLO Mapping type.
* `importPath`: The import path of the publishable library, e.g., `@my-org/my-lib` (only used and required if `--createLibProject` is `true`).


### SLO Controller

To generate a controller for an existing SLO Mapping, use the following command:

```sh
polaris-cli g slo-controller <name> --sloMappingTypePkg=<slo-mapping-type-npm-package> --sloMappingType=<slo-mapping-type-name>
```

**Parameters:**
* `name`: Name of the new SLO controller project. E.g., `cost-eff-slo-controller`.
* `sloMappingTypePkg`: The name of the npm package that contains the SLO Mapping type, e.g., `@my-org/my-lib`. If the npm package is not part of a project in this workspace, it will be installed automatically.
* `sloMappingType`: The name of the SLO Mapping type class. E.g., `CostEfficiencySloMapping`.


### Elasticity Strategy

To generate a new Elasticity Strategy type, use the following command:

```sh
polaris-cli g elasticity-strategy <name> --project=<dest-project> --createLibProject=<true|false> --importPath=<npm-package-name-of-dest-project>
```

**Parameters:**
* `name`: The name of the new Elasticity Strategy type. E.g., `MyHorizontalElasticityStrategy`.
* `project`: The name of the publishable library project, to which the Elasticity Strategy type should be added. E.g., `my-lib`.
* `createLibProject`: (optional) Create a publishable library project for the Elasticity Strategy type.
* `importPath`: The import path of the publishable library, e.g., `@my-org/my-lib` (only used and required if `--createLibProject` is `true`).


### Elasticity Strategy Controller

To generate a controller for an existing Elasticity Strategy type, use the following command:

```sh
polaris-cli g elasticity-strategy-controller <name> --eStratTypePkg=<elasticity-strat-type-npm-package> --eStratType=<elasticity-strat-type-name>
```

**Parameters:**
* `name`: Name of the new Elasticity Strategy controller project. E.g., `my-horizontal-elasticity-strategy-controller`.
* `eStratTypePkg`: The name of the npm package that contains the Elasticity Strategy type, e.g., `@my-org/my-lib`. If the npm package is not part of a project in this workspace, it will be installed automatically.
* `eStratType`: The name of the Elasticity Strategy type class. E.g., `MyHorizontalElasticityStrategy`.


### Composed Metric Type

To generate a new Composed Metric type, use the following command:

```sh
polaris-cli g composed-metric-type <name> --project=<dest-project> --createLibProject=<true|false> --importPath=<npm-package-name-of-dest-project>
```

**Parameters:**
* `name`: The name of the new Composed Metric type. E.g., `TotalCost`.
* `project`: The name of the publishable library project, to which the Composed Metric type should be added. E.g., `my-lib`.
* `createLibProject`: (optional) Create a publishable library project for the Composed Metric type.
* `importPath`: The import path of the publishable library, e.g., `@my-org/my-lib` (only used and required if `--createLibProject` is `true`).


### Composed Metrics Controller

To generate a controller for an existing Composed Metric type, use the following command:

```sh
polaris-cli g composed-metric-controller <name> --compMetricTypePkg=<composed-metric-type-npm-package> --compMetricType=<composed-metric-type-name>
```

**Parameters:**
* `name`: Name of the new Composed Metric controller project. E.g., `total-cost-metric-controller`.
* `compMetricTypePkg`: The name of the npm package that contains the  Composed Metric type, e.g., `@my-org/my-lib`. If the npm package is not part of a project in this workspace, it will be installed automatically.
* `compMetricType`: The name of the Composed Metric type class. E.g., `TotalCostMetric`.


### Metrics Dashboard Generation

The CLI provides means to generate metrics dashboards from scratch that display relevant metrics.
The CLI will scrape from the connected Kubernetes instance all SloMappings that correspond to the given Composed Metric Type and will
automatically create for each property an own panel.
Further, the current implementation is configured to work with Grafana but we work on modularizing the internals to allow support for other implementations/dashboards. 

#### Usage

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
    
### Metrics Alert Generation

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

### Predicted Metric Controller

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

 
