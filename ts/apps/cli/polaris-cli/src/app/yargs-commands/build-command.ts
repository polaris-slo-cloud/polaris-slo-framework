import { CommandModule } from 'yargs';
import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const NAME = 'name';
const SKIP_BUILD_CACHE = 'skipBuildCache';

/**
 * Factory for creating the command that builds Polaris projects/components.
 */
export function createBuildCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        `build <${NAME}>`,
        'Builds a Polaris project or an SLO Mapping.',
        args => {
            return args.positional(NAME, {
                type: 'string',
                description: 'The name of the project/component that should be built.',
            })
            .option(SKIP_BUILD_CACHE, {
                type: 'boolean',
                description: 'Ignores the build cache and rebuilds the selected project/component and all its dependencies.',
                default: false,
            });
        },
        args => {
            const skipCache = args.skipBuildCache ? '--skip-nx-cache' : '';
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} build ${args.name} --with-deps ${skipCache}`,
            }));
        },
    );
}
