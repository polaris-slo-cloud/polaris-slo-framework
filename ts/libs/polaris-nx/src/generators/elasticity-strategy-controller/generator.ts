import * as path from 'path';
import {
    Generator,
    Tree,
    formatFiles,
    generateFiles,
    offsetFromRoot,
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nrwl/devkit';
import { applicationGenerator } from '@nrwl/node';
import {
    NPM_PACKAGES,
    POLARIS_INIT_LIB_FN_NAME,
    PolarisCliConfig,
    PolarisCliProjectType,
    VERSIONS,
    addDeployTarget,
    addDockerBuildConfig,
    addPolarisDependenciesToPackageJson,
    changeBuildDependencyBundling,
    getElasticityStrategyNames,
    normalizeProjectGeneratorOptions,
    runCallbacksSequentially,
} from '../../util';
import { addCommonWorkspaceRootFiles, generateTypeScriptDockerfile } from '../common';
import { ElasticityStrategyControllerGeneratorNormalizedSchema, ElasticityStrategyControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris Elasticity Strategy Controller..
 */
const generateElasticityStrategyController: Generator<ElasticityStrategyControllerGeneratorSchema> = async (
    host: Tree,
    options: ElasticityStrategyControllerGeneratorSchema,
) => {
    const normalizedOptions = normalizeProjectGeneratorOptions(host, options);

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

    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.getOrCreateControllerProject(normalizedOptions, PolarisCliProjectType.ElasticityStrategyController);
    polarisCliConfig.writeToFile();

    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateElasticityStrategyController;

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
