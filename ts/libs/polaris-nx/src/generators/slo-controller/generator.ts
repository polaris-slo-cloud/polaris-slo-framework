import * as path from 'path';
import {
    Generator,
    Tree,
    addProjectConfiguration,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/node';
import { addPolarisDependenciesToPackageJson, getSloNames, runCallbacksSequentially } from '../../util';
import { SloControllerGeneratorNormalizedSchema, SloControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO Controller..
 */
const generateSloController: Generator<SloControllerGeneratorSchema> =  async (host: Tree, options: SloControllerGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);

    const nodeAppResult = await applicationGenerator(host, {
        name: options.name,
        directory: options.directory,
        tags: options.tags,
    });

    const installPkgsFn = addPolarisDependenciesToPackageJson(host);

    // addProjectConfiguration(
    //     host,
    //     normalizedOptions.projectName,
    //     {
    //         root: normalizedOptions.projectRoot,
    //         projectType: 'library',
    //         sourceRoot: `${normalizedOptions.projectRoot}/src`,
    //         targets: {
    //             build: {
    //                 executor: '@polaris-sloc/polaris-nx:build',
    //             },
    //         },
    //         tags: normalizedOptions.parsedTags,
    //     },
    // );

    addWorkspaceRootFiles(host);
    addSloControllerFiles(host, normalizedOptions);
    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateSloController;


function normalizeOptions(host: Tree, options: SloControllerGeneratorSchema): SloControllerGeneratorNormalizedSchema {
    const workspaceInfo = getWorkspaceLayout(host);
    const name = names(options.name).fileName;
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${workspaceInfo.appsDir}/${projectDirectory}`;
    const parsedTags = options.tags
        ? options.tags.split(',').map((s) => s.trim())
        : [];

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
        parsedTags,
        appsDir: workspaceInfo.appsDir,
        libsDir: workspaceInfo.libsDir,
    };
}

function addSloControllerFiles(host: Tree, options: SloControllerGeneratorNormalizedSchema): void {
    const sloNames = getSloNames(options.sloMappingType);

    const templateOptions = {
        ...sloNames,
        sloMappingTypePkg: options.sloMappingTypePkg,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        appsDir: options.appsDir,
        copyWorkspaceFilesCmd: generateDockerfileCopyWorkspaceConfig(host),
        pkgInstallCmd: generateDockerfilePackageInstallCmd(host),
        copyLibsDirCmd: generateDockerfileCopyLibs(host, options.libsDir),
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files/slo-controller'), options.projectRoot, templateOptions);
}

function addWorkspaceRootFiles(host: Tree): void {
    if (!host.exists('.dockerignore')) {
        const templateOptions = {
            template: '',
        };
        generateFiles(host, path.join(__dirname, 'files/workspace-root'), '.', templateOptions);
    }
}

/**
 * Generates the Dockerfile command to copy the libs directory, if it exists.
 */
function generateDockerfileCopyLibs(host: Tree, libsDir: string): string {
    if (libsDir && host.exists(libsDir)) {
        return `COPY ./${libsDir} ./${libsDir}`;
    }
    return '';
}

/**
 * Generates the Dockerfile command to copy the workspace configuration files.
 */
function generateDockerfileCopyWorkspaceConfig(host: Tree): string {
    let files = 'nx.json package.json tsconfig.base.json';

    const appendIfExists: (fileName: string) => void = (fileName: string) => {
        if (host.exists(fileName)) {
            files += ` ${fileName}`;
        }
    };

    appendIfExists('package-lock.json');
    appendIfExists('yarn.lock');
    appendIfExists('angular.json');
    appendIfExists('decorate-angular-cli.js');
    appendIfExists('workspace.json');

    return `COPY ${files} ./`
}

/**
 * Generates the Dockerfile command to install npm packages.
 */
function generateDockerfilePackageInstallCmd(host: Tree): string {
    if (host.exists('yarn.lock')) {
        return 'RUN yarn install --non-interactive'
    }
    return 'RUN npm install --unsafe-perm';
}
