# Polaris Plugin for Nx CLI

This library is a plugin for the [Nx](https://nx.dev) CLI.


## Features

This plugin supplies builders and generators for the following types:
* `slo-mapping-type`: creates a new SLO mapping type that can be used by consumers to apply and configure an SLO.
* `slo-controller`: creates an SLO controller for an SLO mapping type.
* `slo-mapping`: creates a new mapping instance for an existing SLO mapping type.


## Getting Started

To get started, you need to [create an empty Nx workspace](https://nx.dev/latest/node/getting-started/nx-setup).
To do this, open a terminal and navigate to the location, where you want to create the workspace.
Then, do the following (always replace `my-workspace` with your workspace's name):

1. While not strictly required, it is recommended to install Nx CLI globally, because it will allow you to run commands more easily.
    ```shell
    npm install -g nx
    ```

1. Create an empty workspace.
    ```shell
    npx create-nx-workspace --preset=empty my-workspace
    ```

1. Add the Polaris plugin to your workspace.
    ```shell
    cd my-workspace
    npm install --save-dev @polaris-sloc/polaris-nx
    ```



## `slo-mapping-type`

An `slo-mapping-type` needs to be part of a publishable npm package (i.e., a publishable library project).

If you already have a library project, e.g., `my-slo-lib`, create the SLO Mapping type as follows:

```shell
nx g @polaris-sloc/polaris-nx:slo-mapping-type cost-efficiency --project=my-slo-lib
```

If you don't have a publishable library project yet, you can create one using the `@nrwl/node:library` generator, or let the `slo-mapping-type` generator create one for you:

```shell
nx g @polaris-sloc/polaris-nx:slo-mapping-type cost-efficiency --project=my-slo-lib --createLibProject=true --importPath=@my-org/my-slo-lib
```

Both versions will generate the `CostEfficiencySlo` class in the file `cost-efficiency.slo.ts` and export it from the library.



## `slo-controller`

An SLO controller is an application that is run as a controller in the orchestrator that watches SLO mapping instances to evaluate an SLO and trigger the configured elasticity strategy.

1. Create an `slo-controller` application project.
    ```shell
    nx g @polaris-sloc/polaris-nx:slo-controller cost-efficiency-slo-controller --sloMappingTypePkg=@my-org/my-slo-lib --sloMappingType=CostEfficiencySlo
    ```



## `slo-mapping`

An `slo-mapping` needs to be part of an existing library project, which does not need to be buildable, because there is a custom builder for SLO mappings.

1. Create a node library project, if you don't have one.
    ```shell
    nx g @nrwl/node:library my-slo-mappings
    ```

1. Create the SLO Mapping.
    ```shell
    nx g @polaris-sloc/polaris-nx:slo-mapping my-slo-mapping --project=my-slo-mappings --sloMappingTypePkg=@my-org/my-slo-lib --sloMappingType=CostEfficiencySlo
    ```



## Running E2E Tests and Manual Testing

Run `nx e2e polaris-nx-e2e` to execute the E2E tests.
This will generate a temporary workspace in the `tmp` subfolder of this workspace, which can also be used for manually testing the plugin.

Running the E2E tests in a JavaScript Debug Terminal in VS Code often makes the tests run into a timeout.
Thus, it seems to be a better strategy to run a test command in the debugger.
To set breakpoints inside polaris-nx, they must be set in the files in the `dist/libs/polaris-nx` directory.
To set breakpoints inside a third-party library, they must be set in the files in the `dist/libs/polaris-nx/node_modules` directory.

If files without an extension should be included by a generator (e.g., Dockerfile), they must be explicitly added to the `assets` of the `polaris-nx` project in `angular.json`.
