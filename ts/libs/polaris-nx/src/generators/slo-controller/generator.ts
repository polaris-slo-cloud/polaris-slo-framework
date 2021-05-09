import * as path from 'path';
import {
    Generator,
    NxJsonProjectConfiguration,
    ProjectConfiguration,
    Tree,
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    names,
    offsetFromRoot,
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/node';
import { POLARIS_INIT_LIB_FN_NAME, addPolarisDependenciesToPackageJson, getSloNames, runCallbacksSequentially } from '../../util';
import { SloControllerGeneratorNormalizedSchema, SloControllerGeneratorSchema } from './schema';

type ProjectConfig = ProjectConfiguration & NxJsonProjectConfiguration;

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

    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    addDockerBuildConfig(projectConfig, normalizedOptions);
    addDeployTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

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

/**
 * Adds a `docker-build` target to the project's configuration.
 */
function addDockerBuildConfig(projectConfig: ProjectConfig, options: SloControllerGeneratorNormalizedSchema): void {
    projectConfig.targets['docker-build'] = {
        executor: '@nrwl/workspace:run-commands',
        options: {
            commands: [
                // eslint-disable-next-line max-len
                `docker build -f ./${options.projectRoot}/Dockerfile --build-arg POLARIS_APP_TYPE=slo --build-arg POLARIS_APP_NAME=${options.projectName} -t ${getContainerImageName(options)}:latest .`,
            ],
            parallel: false,
        },
    };
}

/**
 * Adds a `deploy` target to the project's configuration to allow deploying the controller to an orchestrator.
 */
 function addDeployTarget(projectConfig: ProjectConfig, options: SloControllerGeneratorNormalizedSchema): void {
    projectConfig.targets['deploy'] = {
        executor: '@nrwl/workspace:run-commands',
        options: {
            commands: [
                // Allows specifying the destination context, but if user does not specify the destination, its string value is 'undefined'
                // `kubectl apply --context='{args.destination}' -f ./${options.projectRoot}/manifests/kubernetes`,
                `kubectl apply -f ./${options.projectRoot}/manifests/kubernetes`,
            ],
            parallel: false,
        },
    };
}

function addSloControllerFiles(host: Tree, options: SloControllerGeneratorNormalizedSchema): void {
    const sloNames = getSloNames(options.sloMappingType);

    const templateOptions = {
        ...sloNames,
        sloMappingTypePkg: options.sloMappingTypePkg,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        controllerProjectName: options.projectName,
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

/**
 * Generates the name of the container image for this controller.
 */
function getContainerImageName(options: SloControllerGeneratorNormalizedSchema): string {
    return `polarissloc/${options.projectName}`;
}
