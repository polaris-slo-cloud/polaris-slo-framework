#!/usr/bin/env node

import { PolarisCliImpl } from './app/polaris-cli.impl';
import { findWorkspaceRoot } from './app/util';

const POLARIS_CLI_MAIN_JS = '@polaris-sloc/cli/src/main.js';

const startupDir = process.cwd();
const workspaceRoot = findWorkspaceRoot(startupDir);
if (!workspaceRoot) {
    console.log('The current directory is not part of a Polaris or Nx workspace.');
    console.log('To create a new workspace run: polaris-cli init <workspace-name>');
    process.exit(1);
}

// Ensure that a local copy of polaris-cli exists.
let localCli: string;
try {
    localCli = require.resolve(POLARIS_CLI_MAIN_JS, { paths: [ workspaceRoot ] });
} catch (err) {
    console.error('The @polaris-sloc/cli is not installed in the local workspace.');
    console.error('You can add it by running: npm install --save-dev @polaris-sloc/cli');
    process.exit(1);
}

if (localCli === require.resolve(POLARIS_CLI_MAIN_JS)) {
    // We are already running the local version of the CLI.
    launchCli();
} else {
    // We are currently running the globally installed version of the CLI.
    // Hand off to the local version.
    require(localCli);
}

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
