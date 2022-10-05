/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { PolarisCli } from './polaris-cli';
import { DefaultTaskExecutor, TaskExecutor } from './tasks';
import {
    configCommand,
    createBuildCommand,
    createDeployCommand,
    createDockerBuildCommand,
    createGenerateCommand,
    createGenerateCrdCommand,
    createInitCommand,
    createSerializeSloMappingCommand,
} from './yargs-commands';

export class PolarisCliImpl implements PolarisCli {
    readonly startupDir: string;
    readonly workspaceRootDir: string;

    readonly taskExecutor: TaskExecutor = new DefaultTaskExecutor();

    constructor(startupInfo: Pick<PolarisCli, 'startupDir' | 'workspaceRootDir'>) {
        this.startupDir = startupInfo.startupDir;
        this.workspaceRootDir = startupInfo.workspaceRootDir;
    }

    /**
     * Executes the CLI.
     */
    run(): void {
        yargs(hideBin(process.argv))
            .scriptName('polaris-cli')
            .parserConfiguration({
                'unknown-options-as-args': true,
            })
            .command(createInitCommand(this))
            .command(createGenerateCommand(this))
            .command(createSerializeSloMappingCommand(this))
            .command(createBuildCommand(this))
            .command(createDockerBuildCommand(this))
            .command(createDeployCommand(this))
            .command(createGenerateCrdCommand(this))
            .command(configCommand(this))
            .help()
            .recommendCommands()
            .parseSync();
    }
}
