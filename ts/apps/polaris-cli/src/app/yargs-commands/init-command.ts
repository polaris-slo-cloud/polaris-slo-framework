import { promises as fs } from 'fs';
import { CommandModule } from 'yargs';
import { PolarisCli } from '../polaris-cli';
import { PromiseTask, RunNpmBinaryTask } from '../tasks';
import { copyKubeConfigDotSh, devContainerDotJson, dockerfile } from '../util/devcontainer-files';
import { NPM_PACKAGES, VERSIONS } from '../util/packages';
import { createYargsCommand } from './command';

type PackageManager = 'npm' | 'yarn' | 'pnpm';

interface NpmPackageInfo {

    /** Name of the npm package. */
    name: string;

    version?: string;

}

interface NpmPackagesInstallInfo {

    /** The name of the package manager. */
    packageManager: PackageManager;

    /** The packages that should be installed. */
    packages: NpmPackageInfo[]

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
            const pkgMgr: PackageManager = args['packageManager'] as any;
            const workspaceName: string = args['name'];
            const workspaceDir = `${cli.startupDir}/${workspaceName}`;

            return cli.taskExecutor.runTasksSequentially(
                // Set up an Nx workspace
                new RunNpmBinaryTask({
                    // eslint-disable-next-line max-len
                    command: `${NPM_PACKAGES.createNxWorkspace}@${VERSIONS.nx} ${workspaceName} --preset=empty --packageManager=${pkgMgr} --interactive=false --nx-cloud=false `,
                }),
                new RunNpmBinaryTask({
                    command: createPackagesInstallCmd({
                        packageManager: pkgMgr,
                        packages: [
                            { name: NPM_PACKAGES.nrwl.js, version: VERSIONS.nx },
                            { name: NPM_PACKAGES.nrwl.node, version: VERSIONS.nx },
                            { name: NPM_PACKAGES.polaris.nx, version: VERSIONS.polaris },
                            { name: NPM_PACKAGES.polaris.cli, version: VERSIONS.polaris },
                        ],
                        devDependency: true,
                    }),
                    workingDir: workspaceDir,
                }),
                // create devcontainer configuration
                new PromiseTask(async () => {
                    // create folder
                    const basePath = `${workspaceDir}/.devcontainer`;
                    await fs.mkdir(basePath, { recursive: true });
                    // write files in parallel
                    await Promise.all([
                        fs.writeFile(`${basePath}/copy-kube-config.sh`, copyKubeConfigDotSh),
                        fs.writeFile(`${basePath}/devcontainer.json`, devContainerDotJson),
                        fs.writeFile(`${basePath}/Dockerfile`, dockerfile),
                    ]);
                }),
            );
        },
    });
}

function createPackagesInstallCmd(installInfo: NpmPackagesInstallInfo): string {
    const packagesList = installInfo.packages.map(pkg => pkg.version ? `${pkg.name}@${pkg.version}` : pkg.name)
    const packagesStr = packagesList.join(' ');
    let depType: string;

    switch (installInfo.packageManager) {
        case 'npm':
            depType = installInfo.devDependency ? '--save-dev' : '--save'
            return `npm install ${depType} ${packagesStr}`;
        case 'yarn':
            depType = installInfo.devDependency ? '--dev' : '';
            return `yarn add ${depType} ${packagesStr}`;
        case 'pnpm':
            depType = installInfo.devDependency ? '--dev' : '';
            return `pnpm add ${depType} ${packagesStr}`;
    }
}
