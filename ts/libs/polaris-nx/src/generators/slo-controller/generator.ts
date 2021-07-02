import * as path from 'path';
import {
    Generator,
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
import {
    NPM_PACKAGES,
    POLARIS_INIT_LIB_FN_NAME,
    VERSIONS,
    addDeployTarget,
    addDockerBuildConfig,
    addPolarisDependenciesToPackageJson,
    changeBuildDependencyBundling,
    generateDockerfileCopyLibs,
    generateDockerfileCopyWorkspaceConfig,
    generateDockerfilePackageInstallCmd,
    getSloNames,
    runCallbacksSequentially,
} from '../../util';
import { SloControllerGeneratorNormalizedSchema, SloControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO Controller..
 */
const generateSloController: Generator<SloControllerGeneratorSchema> = async (host: Tree, options: SloControllerGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);

    const nodeAppResult = await applicationGenerator(host, {
        name: options.name,
        directory: options.directory,
        tags: options.tags,
    });

    const installPkgsFn = addPolarisDependenciesToPackageJson(host, {
        [NPM_PACKAGES.polaris.orchestrators.kubernetes]: VERSIONS.polaris,
        [NPM_PACKAGES.polaris.queryBackends.prometheus]: VERSIONS.polaris,
    });

    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    changeBuildDependencyBundling(projectConfig);
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
