/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/naming-convention */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { PolarisCli } from './polaris-cli';
import { DefaultTaskExecutor, TaskExecutor } from './tasks';
import {
    createApplySloMappingCommand,
    createBuildCommand,
    createConfigCommand,
    createDeployCommand,
    createDockerBuildCommand,
    createGenerateCommand,
    createGenerateCrdCommand,
    createInitCommand,
    createMigrateCommand,
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
            .command(createApplySloMappingCommand(this))
            .command(createBuildCommand(this))
            .command(createDockerBuildCommand(this))
            .command(createDeployCommand(this))
            .command(createGenerateCrdCommand(this))
            .command(createConfigCommand(this))
            .command(createMigrateCommand(this))
            .help()
            .recommendCommands()
            .parseSync();
    }
}
