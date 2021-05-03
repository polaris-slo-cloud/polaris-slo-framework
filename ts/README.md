# SLO Script

This folder contains all SLO Script components, i.e., the Polaris components written in TypeScript.

The TypeScript subprojects are managed using the [Nx](https://nx.dev) monorepo tools.


## Development Setup

To set up a development environment:

1. Run `npm install` in the `ts` folder of the Polaris repository.
1. If you want to test components locally, set the Kubernetes cluster, where you want to test the controller, as the current context in your KUBECONFIG file.


## Repository Organization

The SLO Script repository is divided into two major parts: libraries and applications.

The [`libs`](./libs) subfolder contains the following library projects:

| Name              | Purpose |
|-------------------|---------|
| [`core`](./libs/core) | Main SLO Script library containing the language abstractions and orchestrator-independent runtime facilities. |
| [`mappings-common-mappings`](./libs/mappings/common-mappings) | Definitions of commonly used, generic SLO Mappings and elasticity strategies. |
| [`orchestrators-kubernetes`](./libs/orchestrators/kubernetes) | Connector library for Kubernetes. |
| [`query-backends-prometheus`](./libs/query-backends/prometheus) | Connector to allow the Metrics Query API to use Prometheus as a backend. |



The [`apps`](./apps) folder contains the following application projects:

| Name              | Purpose |
|-------------------|---------|
| [`cli-sloc-k8s-serializer`](./apps/cli/sloc-k8s-serializer) | Transforms SLO Mappings form SLO Script to Kubernetes-specific YAML. |
| [`slo-cost-efficiency-slo-controller`](./apps/slo/cost-efficiency-slo-controller) | Controller for the cost efficiency SLO (metrics evaluation is currently mocked). |
| [`slo-cpu-usage-slo-controller`](./apps/slo/cpu-usage-slo-controller) | Controller for the CPU usage SLO. |
| [`ui-sloc-ui`](./apps/ui/sloc-ui) | Angular UI for Polaris. |


## Building and Running

To build any application/library use the following command:
```
npm run build -- <subproject-name> --with-deps=true
```
For example, to build the cli-sloc-k8s-serializer app:
```
npm run build -- cli-sloc-k8s-serializer --with-deps=true
```

The output can then be found in the `dist` folder.
