/* eslint-disable arrow-body-style */
/* eslint-disable id-blacklist */
/* eslint-disable no-shadow */
import yargs, { Argv } from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DefaultTaskExecutor } from './app/tasks';

const NX_CLI = 'npx nx';

try {
    main();
} catch (e) {
    console.error(e);
}

function main(): void {
    const taskExecutor = new DefaultTaskExecutor();

    yargs(hideBin(process.argv))
        .scriptName('polaris-cli')
        .command({
            command: 'init',
            describe: 'Creates a new Nx workspace for creating Polaris projects.',
            builder: args => {
                return args.positional('name', {
                    array: false,
                    type: 'string',
                    description: 'The name of the workspace (will be the folder name).',
                });
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
}


function addNameParam(args: Argv<any>): void {
    args.positional('name', {
        array: false,
        type: 'string',
        description: 'The name of the project/component.',
    });
}
