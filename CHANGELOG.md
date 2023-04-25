# Polaris SLO Cloud Changelog

## v0.6.0 (not yet released)

### Breaking Changes

* Upgrade to Node.js v18 - this is the minimum required version from now on.
* Change target JavaScript version to ES2020 (TypeScript tsconfig `target` property).
* Upgrade to Nx v15.9.2 - this requires a manual upgrade of the Nx dependencies in existing Polaris workspaces (**during** this process you will also update the Polaris dependencies). Please run the following commands:
    ```sh
    # Upgrade to latest version of Nx v14 branch.
    npx nx migrate 14.8.8
    npm install
    npx nx migrate --run-migrations
    rm ./migrations.json

    # Upgrade to v15.9.2
    npx nx migrate 15.9.2

    # Before continuing the Nx upgrade, open your package.json file and set all Polaris package versions to "~0.6.0".

    # Continue the Nx upgrade.
    npm install
    npx nx migrate --run-migrations
    rm ./migrations.json
    ```
* Remove deprecated polaris-ui project - this will soon be replaced with another UI project.
* A recent Nx version broke the generation of source maps for applications (see [issue]() and workaround). Apps generated with the polaris-cli contain the workaround, but existing app projects require manually modifying the `webpack.config.js` file (see [changes](https://github.com/polaris-slo-cloud/polaris/pull/68/commits/a33474d75f5b537fb0d6e98dee902b38dd875a54#diff-3a4c63f3f75415fd052210bc27bafbd298fed2b8cf5b043c20fa6de2443691bd)).

### Features

* Allow SLOs to trigger alternative elasticity strategies by setting the optional `SloOutput.elasticityStrategy` and `SloOutput.staticElasticityStrategyConfig` properties.

### Dependency Updates

* Upgrade [Nx libraries](https://nx.dev) to v15.9.2.
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
* Added [Polaris CLI](https://polaris-slo-cloud.github.io/polaris/features/cli.html)
* Added support for generating Custom Resource Definitions (CRDs) from TypeScript code
* Added [OrchestratorGateway](./ts/libs/core/src/lib/orchestrator/public/orchestrator-gateway.ts) to allow creating clients for the underlying orchestrator
* Initial release of [@polaris-sloc](https://www.npmjs.com/settings/polaris-sloc/packages) npm packages
* Removed Go code, because with the TypeScript CRD generator it is no longer needed 


## v0.1.0 (2021-02-01)

* Initial Release
