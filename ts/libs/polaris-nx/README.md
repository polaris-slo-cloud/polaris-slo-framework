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

An `slo-mapping-type` needs to be part of a buildable npm package (i.e., an existing library project).

1. Create a node library project, if you don't have one.
    ```shell
    # Replace "my-slo-lib" with the name of your library and the import path with the final package name, the library should have.
    nx g @nrwl/node:library my-slo-lib --publishable=true --importPath=@my-org/my-slo-lib
    ```

1. Create the SLO Mapping type.
    ```shell
    nx g @polaris-sloc/polaris-nx:slo-mapping-type cost-efficiency --project=my-slo-lib
    ```

This will generate the `CostEfficiencySlo` class in the file `cost-efficiency.slo.ts` and export it from the library.



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
