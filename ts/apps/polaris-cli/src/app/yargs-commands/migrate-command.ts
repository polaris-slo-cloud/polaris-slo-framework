import { CommandModule } from 'yargs';

import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask, Task } from '../tasks';
import { POLARIS_PKGS } from '../util/packages';
import { getLatestReleaseVersion, readFromPackageJson as getNrwlPackages, getNxVersion } from '../util/packages-utils';
import { createYargsCommand } from './command';

const VERSION = 'polarisVersion';

/**
 * Factory for creating a command that migrates the Polaris project to the specified version
 */
export function createMigrateCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        ['migrate <polarisVersion>'],
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
            const NRWL_PACKAGES = getNrwlPackages();

            const tasks: Task[] = [];
            POLARIS_PKGS.forEach(pkg => {
                tasks.push(
                    new RunNpmBinaryTask({
                        command: `${NX_CLI} migrate ${pkg}@${polarisVersion}`,
                    }),
                );
            });
            NRWL_PACKAGES.forEach(pkg => {
                tasks.push(
                    new RunNpmBinaryTask({
                        command: `${NX_CLI} migrate ${pkg}@${nxVersion}`,
                    }),
                );
            });
            return cli.taskExecutor.runTasksSequentially(...tasks);
        },
    );
}
