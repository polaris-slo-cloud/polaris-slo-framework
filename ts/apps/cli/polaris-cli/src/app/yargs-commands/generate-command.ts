import { CommandModule } from 'yargs';
import { NX_CLI, POLARIS_NX, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const TYPE = 'type';
const NAME = 'name';

/**
 * Factory for creating the command that generates new Polaris projects/components.
 */
export function createGenerateCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        [ 'generate <type> <name>', 'g' ],
        'Generates a new Polaris project/component.',
        args => args.positional(TYPE, {
                type: 'string',
                description: 'The type of the project/component that should be created.',
                choices: [
                    'slo-mapping-type',
                    'slo-controller',
                    // 'slo-mapping',
                    'metrics-dashboard',
                    'elasticity-strategy',
                    'elasticity-strategy-controller',
                ],
            })
            .positional(NAME, {
                type: 'string',
                description: 'The name of the project/component.',
            }),
        args => {
            const options = args._.slice(0).join(' ') || '--help';
            return cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `${NX_CLI} g ${POLARIS_NX}:${args.type} ${args.name} ${options}`,
            }));
        },
    );
}
