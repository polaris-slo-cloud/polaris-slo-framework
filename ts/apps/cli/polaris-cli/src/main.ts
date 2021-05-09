/* eslint-disable id-blacklist */
/* eslint-disable no-shadow */
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { Task, runTasksSequentially } from './app/tasks';

const NX_CLI = 'npx nx';

main();

function main(): void {
    // These tasks will be executed after evaluating the arguments.
    const tasks: Task[] = [];

    yargs(hideBin(process.argv))
        .scriptName('polaris-cli')
        .command({
            command: 'init',
            describe: 'Creates a new Nx workspace for creating Polaris projects.',
            builder: args => {
                args.positional('name', {
                    array: false,
                    type: 'string',
                    description: 'The name of the workspace (will be the folder name).',
                });
                return args;
            },
            handler: args => {

            },
        })
        .command({
            command: 'generate',
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
                addNameParam(args);
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

    runTasksSequentially(...tasks)
        .then(() => {})
        .catch(err => console.error(err));
}


function addNameParam(args: Argv<any>): void {
    args.positional('name', {
        array: false,
        type: 'string',
        description: 'The name of the project/component.',
    });
}
