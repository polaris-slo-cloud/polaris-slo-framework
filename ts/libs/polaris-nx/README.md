# Polaris Plugin for Nx CLI

This library is a plugin for the [Nx](https://nx.dev) CLI.
It is wrapped by the *Polaris CLI*.

For more information, please have a look at the [Polaris CLI documentation](https://polaris-slo-cloud.github.io/polaris-slo-framework/features/cli.html).


## Running E2E Tests and Manual Testing

Run `nx e2e polaris-nx-e2e` to execute the E2E tests.
This will generate a temporary workspace in the `tmp` subfolder of this workspace, which can also be used for manually testing the plugin.

Running the E2E tests in a JavaScript Debug Terminal in VS Code often makes the tests run into a timeout.
Thus, it seems to be a better strategy to run a test command in the debugger.
To set breakpoints inside polaris-nx, they must be set in the files in the `dist/libs/polaris-nx` directory.
To set breakpoints inside a third-party library, they must be set in the files in the `dist/libs/polaris-nx/node_modules` directory.

If files without an extension should be included by a generator (e.g., Dockerfile), they must be explicitly added to the `assets` of the `polaris-nx` project in `angular.json`.

To test the Polaris CLI wrapper around the Nx plugin, please see the [README](../../apps/cli/polaris-cli/README.md) of the Polaris CLI.
