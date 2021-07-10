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
    getElasticityStrategyNames,
    runCallbacksSequentially,
} from '../../util';
import { addCommonWorkspaceRootFiles, generateTypeScriptDockerfile } from '../common';
import { ElasticityStrategyControllerGeneratorNormalizedSchema, ElasticityStrategyControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris Elasticity Strategy Controller..
 */
const generateSloController: Generator<ElasticityStrategyControllerGeneratorSchema> = async (
    host: Tree,
    options: ElasticityStrategyControllerGeneratorSchema,
) => {
    const normalizedOptions = normalizeOptions(host, options);

    const nodeAppResult = await applicationGenerator(host, {
        name: options.name,
        directory: options.directory,
        tags: options.tags,
    });

    const installPkgsFn = addPolarisDependenciesToPackageJson(host, {
        [NPM_PACKAGES.polaris.orchestrators.kubernetes]: VERSIONS.polaris,
    });

    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    changeBuildDependencyBundling(projectConfig);
    addDockerBuildConfig(projectConfig, normalizedOptions);
    addDeployTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

    addCommonWorkspaceRootFiles(host);
    addElasticityStrategyControllerFiles(host, normalizedOptions);
    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateSloController;


function normalizeOptions(host: Tree, options: ElasticityStrategyControllerGeneratorSchema): ElasticityStrategyControllerGeneratorNormalizedSchema {
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

function addElasticityStrategyControllerFiles(host: Tree, options: ElasticityStrategyControllerGeneratorNormalizedSchema): void {
    const eStratNames = getElasticityStrategyNames(options.eStratType);

    const templateOptions = {
        ...eStratNames,
        eStratTypePkg: options.eStratTypePkg,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        controllerProjectName: options.projectName,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        appsDir: options.appsDir,
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files/elasticity-strategy-controller'), options.projectRoot, templateOptions);
    generateTypeScriptDockerfile(host, options);
}
