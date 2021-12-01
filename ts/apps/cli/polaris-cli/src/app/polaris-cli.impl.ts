import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { PolarisCli } from './polaris-cli';
import { DefaultTaskExecutor, TaskExecutor } from './tasks';
import {
    createBuildCommand,
    createDeployCommand,
    createDockerBuildCommand,
    createGenerateCommand,
    createGenerateCrdCommand,
    createInitCommand,
} from './yargs-commands';

export class PolarisCliImpl implements PolarisCli {

    readonly startupDir: string;

    readonly taskExecutor: TaskExecutor = new DefaultTaskExecutor();

    constructor(startupInfo: Pick<PolarisCli, 'startupDir'>) {
        this.startupDir = startupInfo.startupDir;
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
            .command(createBuildCommand(this))
            .command(createDockerBuildCommand(this))
            .command(createDeployCommand(this))
            .command(createGenerateCrdCommand(this))
            .help()
            .recommendCommands()
            .parseSync();
    }

}
