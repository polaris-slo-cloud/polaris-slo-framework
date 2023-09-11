# Polaris SLO Framework Changelog

## v0.8.0 (not released yet)

### Features

* Local npm registry using [Verdaccio](https://verdaccio.org/)
* Run e2e tests in GithubActions
* Docker-build command using an Nx executor



## v0.7.0 (2023-11-03)

### Features

* Add `countByGroup()` to `TimeInstantQuery`.



## v0.6.3 (2023-09-01)

### Bugfixes

* Fix tslib peer dependency conflict.


### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v16.7.4.
* Upgrade to TypeScript v5.1.6.



## v0.6.2 (2023-07-12)

### Bugfixes

* Add a last modified label to elasticity strategy objects in Kubernetes to ensure that an elasticity strategy controller is triggered even if the SLO Output remains unchanged. For example, an SLO may require scaling out by the same amount as last time (same SLO Output), which would normally not be considered a change by Kubernetes.



## v0.6.1 (2023-05-05)

### Manual Changes

* If you are currently on Polaris v0.6.0:
    * Upgrade to Nx v16.1.0.
        ```sh
        npx nx migrate 16.1.0

        # Open package.json and update all @polaris-sloc package versions to "~0.6.1"

        npm install
        ```
* If you are currently on Polaris v0.5.0 or earlier:
    * Follow the Polaris v0.6.0 breaking changes instructions below, but use @nx version 16.1.0 instead of 16.0.3 and @polaris-sloc version ~0.6.1 instead of ~0.6.0.
* To enable embedding TypeScript sources into npm packages for existing library projects, please make [this change](https://github.com/polaris-slo-cloud/polaris-slo-framework/commit/83fb63ad6805a8bea9cfa6f9c65d1a63dbdc1d27#diff-bcfd1fda3080038ca9467864bc4ea79ff75d2a968a1b5536eeb09634f153f173) to the `tsconfig.lib.json` files of your library projects.


### Bugfixes

* Fix missing TypeScript source code referenced from source maps in Polaris npm packages.


### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v16.1.0.
* Upgrade to TypeScript v5.0.4.



## v0.6.0 (2023-05-03)

### Breaking Changes

* Upgrade to Node.js v18 - this is the minimum required version from now on.
* Change target JavaScript version to ES2020 (TypeScript tsconfig `target` property).
* Remove deprecated polaris-ui project - this has been replaced with a new [polaris-ui](https://github.com/polaris-slo-cloud/polaris-ui) project.
* **Manual change required:** Upgrade to Nx v16.0.3 - this requires a manual upgrade of the Nx dependencies in existing Polaris workspaces (**during** this process you will also update the Polaris dependencies). Please run the following commands:
    ```sh
    # Upgrade to latest version of Nx v14 branch.
    npx nx migrate 14.8.8
    npm install
    npx nx migrate --run-migrations
    rm ./migrations.json

    # Upgrade to Nx v16.0.3
    npx nx migrate 16.0.3
    # IMPORTANT: Before continuing the Nx upgrade, open your package.json file and set all @polaris-sloc package versions to "~0.6.0".
    # Continue the Nx upgrade.
    npm install
    npx nx migrate --run-migrations
    rm ./migrations.json

    # Install the Nx webpack plugin, if not present.
    npm install --save-dev -E @nx/webpack@16.0.3

    # Search all project.json files or the angular.json file (if present) for `"executor": "@nrwl/webpack:webpack"` and replace it with `"executor": "@nx/webpack:webpack"`
    # If your workspace contains webpack.config.js files, apply the source maps workaround below.

    # Update the Dockerfiles of your applications according to the example file linked below.
    ```
* **Manual change required:** A recent Nx version broke the generation of source maps for applications (see [issue](https://github.com/nrwl/nx/issues/15159) and [workaround](https://github.com/nrwl/nx/issues/14708#issuecomment-1457996600)). Apps generated with the polaris-cli contain the workaround, but existing app projects require manually modifying the `webpack.config.js` file, if present in your project (see [working webpack.config.js](https://github.com/polaris-slo-cloud/polaris-slo-framework/blob/a266c010161a3277b4b3b8126cc7ae7b8d5a423e/ts/apps/elasticity/horizontal-elasticity-strategy-controller/webpack.config.js)).
* **Manual change required:** The changes in the structure of Nx projects and the Node.js upgrade requires changes to the Dockerfiles of existing applications. Copy this [updated Dockerfile](https://github.com/polaris-slo-cloud/polaris-demos/blob/b891094703ea038b46fc68278fb014b1cd090720/horizontal-elasticity-strat/apps/my-horizontal-elasticity-strategy-controller/Dockerfile) over your existing ones.

### Features

* Allow SLOs to trigger alternative elasticity strategies by setting the optional `SloOutput.elasticityStrategy` and `SloOutput.staticElasticityStrategyConfig` properties.

### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v16.0.3.
* Migrate to Nx project.json files and remove Angular CLI.
* Remove all Angular dependencies, except for `@angular-devkit/core` and `@angular-devkit/schematics`, which are required by a dependency of `polaris-nx`.


## v0.5.0 (2023-03-09)

### Features

* Add histogram quantile support to core/raw-metrics-query and the prometheus adapter

### Bugfixes

* Lock `@openapi-contrib/json-schema-to-openapi-schema` to v2.1.1 and `ts-json-schema-generator` to v1.0.0 to avoid issues in YAML generation.



## v0.4.1 (2022-07-11)

### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v14.4.0.

### Bugfixes

* Make generated library projects buildable.



## v0.4.0 (2022-04-26)

### Features

* Allow configuring the computation interval of a composed metric controller through the `COMPOSED_METRIC_COMPUTATION_INTERVAL_MS` environment variable.

### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v14.0.3.
* Upgrade [ts-json-schema-generator](https://github.com/vega/ts-json-schema-generator) to v1.0.0.


### Bugfixes

* Ensure that the polaris-cli exists with an error code if an error occurs during execution.
* Explicitly handle invalid composed metric values in the Prometheus `ComposedMetricsManager`.
* Added missing `js-yaml` v4.1.0 as a dependency of `@polaris-sloc/schema-gen`.
* Fix Docker build failure when not using BuildKit by upgrading to Nx v14.0.3 (see [details](https://github.com/nrwl/nx/issues/9451)).



## v0.3.0 (2022-03-12)

### Features

* Removed the default `ServiceMonitor` selector in the `3-service-monitor.yaml` files and improved the inline documentation about these selectors.
* Changed the default `PROMETHEUS_HOST` in the `2-slo-controller.yaml` and `2-metrics-controller.yaml` files to `prometheus-kube-prometheus-prometheus.monitoring.svc` to match the updated tutorial using the [kube-prometheus-stack](https://github.com/prometheus-community/helm-charts/tree/main/charts/kube-prometheus-stack) helm chart.
* Upgrade the base container image for controllers to `node:14-alpine3.15`.
* Upgrade [Nx libraries](https://nx.dev) to v13.8.8.



## v0.2.2 (2022-03-08)

### Features

* Locked Nx and Polaris package versions for the `polaris-cli init` command to the ones used in that polaris-cli version to avoid problems with breaking changes in new versions.


### Bugfixes

* Fix a regression introduced by Nx v13.8.4. A [refactoring of the Nx JS and Node.js](https://github.com/nrwl/nx/pull/9086) generators caused the use of a removed builder for generated libraries.



## v0.2.1 (2022-02-24)

### Features

* Added the following `TimeInstantQuery` operations: `averageByGroup()`, `minByGroup()`, and `maxByGroup()`


## v0.2.0 (2022-02-21)

### Features

* Added support for writing elasticity strategies in TypeScript
* Added support for [ComposedMetrics](./ts/libs/core/src/lib/composed-metrics)
* Added support for predicted metric controllers
* Rewrote HorizontalElasticityStrategy in TypeScript and added stabilization window support
* Added VerticalElasticityStrategy
* Added [Polaris CLI](https://polaris-slo-cloud.github.io/polaris-slo-framework/features/cli.html)
* Added support for generating Custom Resource Definitions (CRDs) from TypeScript code
* Added [OrchestratorGateway](./ts/libs/core/src/lib/orchestrator/public/orchestrator-gateway.ts) to allow creating clients for the underlying orchestrator
* Initial release of [@polaris-sloc](https://www.npmjs.com/settings/polaris-sloc/packages) npm packages
* Removed Go code, because with the TypeScript CRD generator it is no longer needed 


## v0.1.0 (2021-02-01)

* Initial Release
