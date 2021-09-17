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
| [`cli-polaris-k8s-serializer`](./apps/cli/polaris-k8s-serializer) | Transforms SLO Mappings form SLO Script to Kubernetes-specific YAML. |
| [`slo-cost-efficiency-slo-controller`](./apps/slo/cost-efficiency-slo-controller) | Controller for the cost efficiency SLO (metrics evaluation is currently mocked). |
| [`slo-cpu-usage-slo-controller`](./apps/slo/cpu-usage-slo-controller) | Controller for the CPU usage SLO. |
| [`ui-polaris-ui`](./apps/ui/polaris-ui) | Angular UI for Polaris. |


## Building and Running

To build any application/library use the following command:
```
npm run build -- <subproject-name>
```
For example, to build the cli-polaris-k8s-serializer app:
```
npm run build -- cli-polaris-k8s-serializer
```

The output can then be found in the `dist` folder.


## Debugging in VS Code

For some applications, there are debug configurations in `.vscode/launch.json`.
These can be launched directly from the VS Code "Run and Debug" panel.

For applications without a dedicated debug config, the easiest way to debug them is the following:

1. Build the respective application project (see [Building and Running](#building-and-running)).

2. Open a "JavaScript Debug Terminal" in VS Code.

3. Run the application using Node.JS.

```sh
node ./dist/apps/<app-type>/<app-name>/main.js

# If necessary, set any environment variables for your development environment.
# E.g., If debugging the cost efficiency SLO controller when Prometheus is available on port 30900:
PROMETHEUS_PORT=30900 node ./dist/apps/slo/cost-efficiency-slo-controller/main.js
```
