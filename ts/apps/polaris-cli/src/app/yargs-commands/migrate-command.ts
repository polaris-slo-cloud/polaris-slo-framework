import { CommandModule } from 'yargs';

import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask, RunProcessTask, Task } from '../tasks';
import { POLARIS_PKGS } from '../util/packages';
import {
    getLatestReleaseVersion,
    getNxPackages,
    getNxVersion,
} from '../util/packages-utils';
import { createYargsCommand } from './command';

const VERSION = 'polaris-version';

/**
 * Factory for creating a command that migrates the Polaris project to the specified version
 */
export function createMigrateCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        ['migrate <polaris-version>'],
        'Migrate to a specific Polaris version.',
        args =>
            args.positional(VERSION, {
                type: 'string',
                description: 'The version to migrate to.',
            }),
        async args => {
            const latestVersion = await getLatestReleaseVersion();
            const polarisVersion = args.polarisVersion === 'latest' ? latestVersion : `v${args.polarisVersion}`;
            const nxVersion = await getNxVersion(polarisVersion);
            const NRWL_PACKAGES = getNxPackages();

            const tasks: Task[] = [
                ...POLARIS_PKGS.map(pkg =>
                    new RunNpmBinaryTask({
                        command: `${NX_CLI} migrate ${pkg}@${polarisVersion}`,
                    }),
                ),
                ...NRWL_PACKAGES.map(pkg =>
                    new RunNpmBinaryTask({
                        command: `${NX_CLI} migrate ${pkg}@${nxVersion}`,
                    }),
                ),
                new RunNpmBinaryTask({
                    command: `${NX_CLI} migrate --run-migrations`
                }),
                new RunProcessTask({
                    command: 'rm migrations.json'
                })
            ];

            return cli.taskExecutor.runTasksSequentially(...tasks);
        },
    );
}
