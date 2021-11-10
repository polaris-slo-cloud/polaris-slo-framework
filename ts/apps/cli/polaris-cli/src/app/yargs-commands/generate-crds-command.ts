import { CommandModule } from 'yargs';
import { NX_CLI, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const PROJECT = 'project';

/**
 * Factory for creating the command that generates Kubernetes CRDs from existing Polaris types.
 */
export function createGenerateCrdCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        [ `generate-crds <${PROJECT}>`, 'gen-crds' ],
        'Generates a Custom Resource Definition (CRD) for an existing Polaris ApiObject type.',
        args => args.positional(PROJECT, {
                type: 'string',
                description: 'The name of the project that contains the type.',
            }),
        args => {
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} run ${args.project}:gen-crds`,
            }));
        },
    );
}
