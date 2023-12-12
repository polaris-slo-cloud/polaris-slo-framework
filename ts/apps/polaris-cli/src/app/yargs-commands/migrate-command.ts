import { CommandModule } from 'yargs';

import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask, RunProcessTask, Task } from '../tasks';
import { NPM_PACKAGES, getLatestReleaseVersion, getNxVersion } from '../util/packages';
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
            const polarisVersion = args.polarisVersion === 'latest' ? await getLatestReleaseVersion() : `v${args.polarisVersion}`;
            const nxVersion = await getNxVersion(polarisVersion);

            const tasks: Task[] = [
                new RunNpmBinaryTask({
                    command: `${NX_CLI} migrate ${nxVersion}`,
                }),
                new RunNpmBinaryTask({
                    command: `${NX_CLI} migrate --run-migrations`
                }),
                new RunNpmBinaryTask({
                    command: `${NX_CLI} migrate ${NPM_PACKAGES.polaris.nx}@${polarisVersion}`,
                }),
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
