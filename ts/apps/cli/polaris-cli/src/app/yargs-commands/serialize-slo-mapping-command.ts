import { CommandModule } from 'yargs';
import { NX_CLI, POLARIS_NX, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const SLO_MAPPING_TS_PATH = 'slo-mapping-ts-path';

/**
 * Factory for creating the command that serializes an existing SLO Mapping instance from a file.
 */
export function createSerializeSloMappingCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        [ `serialize-slo-mapping <${SLO_MAPPING_TS_PATH}>`, 'serialize' ],
        'Serialize an SLO Mapping instance from a .ts file to a Kubernetes-specific YAML.',
        args => args.positional(SLO_MAPPING_TS_PATH, {
                type: 'string',
                description: 'The path of the SLO Mapping\'s .ts file within the slo-mappings directory.',
            }),
        args => {
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} g ${POLARIS_NX}:serialize-slo-mapping ${args['slo-mapping-ts-path']}`,
            }));
        },
    );
}
