import { CommandModule } from 'yargs';
import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const NAME = 'name';

/**
 * Factory for creating the command that deploys a Polaris project or component to an orchestrator.
 */
export function createDeployCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        `deploy <${NAME}>`,
        'Deploys a Polaris project or an SLO Mapping to an orchestrator.',
        args => {
            return args.positional(NAME, {
                type: 'string',
                description: 'The name of the project that should be built.',
            });
        },
        args => {
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} run ${args.name}:deploy`,
            }));
        },
    );
}
