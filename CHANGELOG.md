# Polaris SLO Cloud Changelog

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
