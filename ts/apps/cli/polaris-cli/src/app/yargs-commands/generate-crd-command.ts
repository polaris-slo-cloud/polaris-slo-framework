import { CommandModule } from 'yargs';
import { NX_CLI, POLARIS_NX, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const PROJECT = 'project';
const TYPE = 'type';

/**
 * Factory for creating the command that generates Kubernetes CRDs from existing Polaris types.
 */
export function createGenerateCrdCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        [ `generate-crd <${PROJECT}> <${TYPE}>`, 'crd' ],
        'Generates a Custom Resource Definition (CRD) for an existing Polaris ApiObject type.',
        args => args.positional(PROJECT, {
                type: 'string',
                description: 'The name of the project that contains the type.',
            })
            .positional(TYPE, {
                type: 'string',
                description: 'The ApiObject type, for which to generate the CRD.',
            }),
        args => {
            const options = args._.slice(0).join(' ') || '--help';

            // ToDo
            // return cli.taskExecutor.runTask(new RunNpmBinaryTask({
            //     command: `${NX_CLI} g ${POLARIS_NX}:${args.type} ${args.name} ${options}`,
            // }));
        },
    );
}
