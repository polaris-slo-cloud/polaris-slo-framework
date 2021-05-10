import { CommandModule } from 'yargs';
import { PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

export function createInitCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand({
        command: 'init',
        describe: 'Creates a new Nx workspace for creating Polaris projects.',
        builder: args => {
            return args.positional('name', {
                array: false,
                type: 'string',
                description: 'The name of the workspace (will be the folder name).',
            });
        },
        handler: async args => {
            await cli.taskExecutor.runTask(new RunNpmBinaryTask({
                command: `create-nx-workspace ${args['name']} --preset=empty`,
            }));
        },
    });
}
