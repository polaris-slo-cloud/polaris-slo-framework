#!/usr/bin/env node

import { PolarisCliImpl } from './app/polaris-cli.impl';
import { allowExecutingGlobalCli, findWorkspaceRoot } from './app/util';

const POLARIS_CLI_MAIN_JS = '@polaris-sloc/cli/src/main.js';

const startupDir = process.cwd();
const workspaceRoot = findWorkspaceRoot(startupDir);
const globalCliOptions = allowExecutingGlobalCli(process.argv);

if (workspaceRoot) {
    if (globalCliOptions.requireExecutingOutsideOfWorkspace) {
        console.log('Cannot run polaris-cli init in the current directory, because it is already part of a Polaris or Nx workspace.');
        process.exit(1);
    }
    runWithinWorkspace();
} else {
    if (!globalCliOptions.requireExecutingOutsideOfWorkspace) {
        console.log('The current directory is not part of a Polaris or Nx workspace.');
        console.log('To create a new workspace run: polaris-cli init <workspace-name> [--packageManager <npm|yarn|pnpm>]');
        process.exit(1);
    }
    runOutsideWorkspace();
}


function runWithinWorkspace(): void {
    // Check if a local copy of polaris-cli exists.
    let localCli: string;
    try {
        localCli = require.resolve(POLARIS_CLI_MAIN_JS, { paths: [ workspaceRoot ] });
    } catch (err) {}

    if (localCli) {
        // A local CLI was found, so we need to load it, if we have not done so already.
        if (localCli === require.resolve(POLARIS_CLI_MAIN_JS)) {
            // We are already running the local version of the CLI.
            launchCli();
        } else {
            // We are currently running the globally installed version of the CLI.
            // Hand off to the local version.
            require(localCli);
        }
    } else {
        // No local CLI was found, so we run the global one, if allowed, or signal an error.
        if (globalCliOptions.allowGlobalCli) {
            launchCli();
        } else {
            console.error('The @polaris-sloc/cli is not installed in the local workspace.');
            console.error('You can add it by running: npm install --save-dev @polaris-sloc/cli');
            process.exit(1);
        }
    }
}

function runOutsideWorkspace(): void {
    launchCli();
}

/**
 * Launches the CLI implementation in the current process.
 */
function launchCli(): void {
    try {
        const cli = new PolarisCliImpl({
            startupDir,
            workspaceRootDir: workspaceRoot,
        });
        cli.run();
    } catch (e) {
        console.error(e);
    }
}
