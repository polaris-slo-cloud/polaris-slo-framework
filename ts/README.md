# Polaris SLO Script

This folder contains all Polaris SLO Script components, i.e., the Polaris components written in TypeScript.

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
| [`common-mappings`](./libs/common-mappings) | Definitions of commonly used, generic SLO Mappings and elasticity strategies. |
| [`kubernetes`](./libs/kubernetes) | Connector library for Kubernetes. |
| [`prometheus`](./libs/prometheus) | Connector to allow the Metrics Query API to use Prometheus as a backend. |
| [`polaris-nx`](./libs/polaris-nx) | Nx CLI plugin that implements the actions of the Polaris CLI. |
| [`schema-gen`](./libs/schema-gen) | Supports the generation of Custom Resource Definitions (CRDs) from TypeScript code. |



The [`apps`](./apps) folder contains the following application projects:

| Name              | Purpose |
|-------------------|---------|
| [`polaris-cli`](./apps/polaris-cli) | Polaris CLI convenience wrapper around the `polaris-nx` Nx plugin. |
| [`slo-cost-efficiency-slo-controller`](./apps/slo/cost-efficiency-slo-controller) | Controller for the cost efficiency SLO (metrics evaluation is currently mocked). |
| [`slo-cpu-usage-slo-controller`](./apps/slo/cpu-usage-slo-controller) | Controller for the CPU usage SLO. |
| [`ui-polaris-ui`](./apps/ui/polaris-ui) | Angular UI for Polaris. |



Additionally, the [`crds`](./crds) subfolder contains the Kubernetes Custom Resource Definitions (CRDs) generated for the Polaris ApiObject types defined by the libraries in this repo.


## Building and Running

To build any application/library use the following command:
```
npm run build -- <subproject-name>
```
For example, to build the polaris-cli app:
```
npm run build -- polaris-cli
```

The output can then be found in the `dist` folder.


### Building all Components

To build all components, execute the following command:
```sh
./build-all.sh
```


### Updating the Polaris Package Versions

To update all @polaris-sloc package versions at once, run the [`set-polaris-pkg-version.sh`](./set-polaris-pkg-version.sh) script.
For example:
```sh
./set-polaris-pkg-version.sh 0.2.0
```


### Regenerating the CRDs

To regenerate the CRDs, execute the following command:
```sh
npm run gen-crds
```


### Publishing npm Packages

To build and publish all npm packages with their currently configured versions, use the [`build-and-publish-npm-packages.sh`](./build-and-publish-npm-packages.sh) script.


#### Module Code Generation

All @polaris-sloc packages are currently built as CommonJS modules.
We do not use ECMA Script modules (yet), because the TypeScript compiler does not alter `import { Type } from 'module-specifier'` statements in that mode, because they are valid ECMA Script (see, e.g., TS issues [#40878](https://github.com/microsoft/TypeScript/issues/40878) and [#42151](https://github.com/microsoft/TypeScript/issues/42151)).
However, bundlers may decide themselves if they require a file extension to be used if the `module-specifier` is a path (see [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/import)).
[Node.JS requires](https://nodejs.org/api/esm.html#mandatory-file-extensions) paths to use a file extension, thus the unchanged local imports from TypeScript are invalid in Node.JS.
Webpack is somehow able to bundle the files correctly into an executable `.js` file for Node.JS.
Since we want our npm packages to be usable without workarounds, we have decided to ship everything in the CommonJS module format for now.

*Note for changing to ES modules:* When changing back to ES modules at some point in the future, the `lodash` and `@types/lodash` dependencies should be replaced with `lodash-es` and `@types/lodash-es` and the following path be added to `tsconfig.base.json`:

```JSON
"paths": {
    // ...
    "lodash": [ "node_modules/lodash-es" ]
}
```



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
