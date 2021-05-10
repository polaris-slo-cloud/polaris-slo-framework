import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DefaultTaskExecutor, TaskExecutor } from './tasks';
import { createInitCommand } from './yargs-commands';

/** Command used to execute the Nx CLI. */
export const NX_CLI = 'nx';

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
            .command(createInitCommand(this))
            .command({
                command: 'generate',
                aliases: 'g',
                describe: 'Generate a Polaris project or component.',
                builder: args => {
                    args.positional('type', {
                        array: false,
                        type: 'string',
                        description: 'The type of project/component that should be generated.',
                        choices: [
                            'slo-mapping-type',
                            'slo-controller',
                            'slo-mapping',
                        ],
                    });
                    this.addNameParam(args);
                    // args.options({
                    //     outDir: {
                    //         alias: 'o',
                    //         default: './',
                    //         string: true,
                    //         desc: 'The directory, where the output CSV files will be created.',
                    //         normalize: true,
                    //     },
                    // });
                    return args;
                },
                handler: args => {
                    // analyze(argv['files'] as string[], argv['outDir'] as string)
                    //     .then()
                    //     .catch(err => console.error(err));

                },
            })
            .command({
                command: 'build',
                describe: 'Builds a Polaris project or an SLO Mapping.',
                builder: args => args,
                handler: args => {

                },
            })
            .command({
                command: 'build-docker',
                describe: 'Builds the Docker image of a compatible Polaris project.',
                builder: args => {
                    console.log('test');
                    return args;
                },
                handler: args => {

                },
            })
            .command({
                command: 'deploy',
                describe: 'Deploys a Polaris project or an SLO Mapping.',
                builder: args => args,
                handler: args => {

                },
            })
            .parse();
    }


    /**
     * Adds the commonly used `name` parameter to an `args` object.
     */
    addNameParam(args: Argv<any>): void {
        args.positional('name', {
            array: false,
            type: 'string',
            description: 'The name of the project/component.',
        });
    }


}
