import { CommandModule } from 'yargs';
import { POLARIS_NX, PolarisCli } from '../polaris-cli';
import { RunNpmBinaryTask } from '../tasks';
import { createYargsCommand } from './command';

type PackageManager = 'npm' | 'yarn' | 'pnpm';

interface NpmPackageInstallInfo {

    /** Name of the npm package. */
    name: string;
    version?: string;
    devDependency?: boolean;

}

/**
 * Factory for creating the command that initializes a new Nx workspace with Polaris support.
 */
export function createInitCommand(cli: PolarisCli): CommandModule<any, any> {
    return createYargsCommand({
        command: 'init <name>',
        describe: 'Creates a new Nx workspace for creating Polaris projects.',
        builder: args => {
            return args
                .positional('name', {
                    array: false,
                    type: 'string',
                    description: 'The name of the workspace (will be the folder name).',
                })
                .option('packageManager', {
                    type: 'string',
                    description: 'The package manager that should be used.',
                    choices: [
                        'npm',
                        'yarn',
                        'pnpm',
                    ],
                    default: 'npm',
                });
        },
        handler: args => {
            const pkgMgr: PackageManager = args['packageManager'];
            const workspaceName: string = args['name'];
            const workspaceDir = `${cli.startupDir}/${workspaceName}`;

            return cli.taskExecutor.runTasksSequentially(
                // Set up an Nx workspace
                new RunNpmBinaryTask({
                    command: `create-nx-workspace ${workspaceName} --preset=empty --packageManager=${pkgMgr} --interactive=false --nx-cloud=false `,
                }),
                new RunNpmBinaryTask({
                    command: createPackageInstallCmd(pkgMgr, {
                        name: POLARIS_NX,
                        devDependency: true,
                    }),
                    workingDir: workspaceDir,
                }),
            );
        },
    });
}


function createPackageInstallCmd(pkgMgr: PackageManager, pkg: NpmPackageInstallInfo): string {
    const pkgNameAndVersion = pkg.version ? `${pkg.name}@${pkg.version}` : pkg.name;
    let depType: string;

    switch (pkgMgr) {
        case 'npm':
            depType = pkg.devDependency ? '--save-dev' : '--save'
            return `npm install ${depType} ${pkgNameAndVersion}`;
        case 'yarn':
            depType = pkg.devDependency ? '--dev' : '';
            return `yarn add ${depType} ${pkgNameAndVersion}`;
        case 'pnpm':
            depType = pkg.devDependency ? '--dev' : '';
            return `pnpm add ${depType} ${pkgNameAndVersion}`;
    }
}
