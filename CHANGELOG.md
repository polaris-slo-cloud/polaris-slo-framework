# Polaris SLO Cloud Changelog

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
