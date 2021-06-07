import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DefaultTaskExecutor, TaskExecutor } from './tasks';
import {
    createBuildCommand,
    createDeployCommand,
    createDockerBuildCommand,
    createGenerateCommand,
    createInitCommand,
} from './yargs-commands';

/** Command used to execute the Nx CLI. */
export const NX_CLI = 'nx';

/** Polaris Nx CLI plugin. */
export const POLARIS_NX = '@polaris-sloc/polaris-nx';

export class PolarisCli {

    /** The directory, where the Polaris CLI was started. */
    readonly startupDir: string;

    /** Used to execute tasks from the CLI's commands. */
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
            .help()
            .recommendCommands()
            .parse();
    }

}
