import { CommandModule } from 'yargs';
import { NX_CLI, POLARIS_NX, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

const MODIFIER = 'modifier';
const PROJECT = 'project';
const KEY = 'key';

/**
 * Factory for getting / setting a field in a Polaris config.
 */
export function configCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand(
        ['config <modifier> <project> <key>'],
        'Get or set a field in the Polaris config.',
        args =>
            args
                .positional(MODIFIER, {
                    type: 'string',
                    description: 'Get or set a parameter of the project/component.',
                    choices: ['get', 'set'],
                })
                .positional(PROJECT, {
                    type: 'string',
                    description: 'The name of the project.',
                })
                .positional(KEY, {
                    type: 'string',
                    description: 'The field to be changed/read.',
                }),
        args => {
            const options = args._.slice(1).join(' ');
            console.log(`${NX_CLI} ${POLARIS_NX}:config ${args.modifier} ${args.project} ${args.key} ${options}`);
            return cli.taskExecutor.runTask(
                new RunNpmBinaryTask({
                    command: `${NX_CLI} ${POLARIS_NX}:config ${args.project} ${args.modifier}  ${args.key} ${options}`,
                }),
            );
        },
    );
}
