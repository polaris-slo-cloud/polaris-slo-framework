import { CommandModule } from 'yargs';
import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const NAME = 'name';

/**
 * Factory for creating the command that builds Docker containers for a containerized Polaris project.
 */
export function createDockerBuildCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        `docker-build <${NAME}>`,
        'Builds the Docker container image for a Polaris controller project.',
        args => {
            return args.positional(NAME, {
                type: 'string',
                description: 'The name of the project that should be built.',
            });
        },
        args => {
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} run ${args.name}:docker-build`,
            }));
        },
    );
}
