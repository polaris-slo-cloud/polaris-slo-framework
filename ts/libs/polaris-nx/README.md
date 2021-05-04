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




## Running E2E Tests and Manual Testing

Run `nx run polaris-nx:e2e` to execute the E2E tests.
This will generate a temporary workspace in the `tmp` subfolder of this workspace, which can also be used for manually testing the plugin.
