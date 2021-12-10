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
import {applicationGenerator} from '@nrwl/node';
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
    getComposedMetricTypeNames,
    getContainerImageName,
    normalizeProjectGeneratorOptions,
    runCallbacksSequentially,
} from '../../util';
import {addCommonWorkspaceRootFiles, generateTypeScriptDockerfile} from '../common';
import {NormalizedPredictedMetricControllerGeneratorSchema, PredictedMetricControllerGeneratorSchema} from './schema';

/**
 * Generates a new Composed Metric Controller.
 */
const generateComposedMetricController: Generator<PredictedMetricControllerGeneratorSchema> = async (
    host: Tree,
    options: PredictedMetricControllerGeneratorSchema,
) => {
    const normalizedOptions = normalizeProjectGeneratorOptions(host, options);

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
    projectConfig.targets['docker-build'] = {
        executor: '@nrwl/workspace:run-commands',
        options: {
            commands: [
                // eslint-disable-next-line max-len
                `docker build -f ./${normalizedOptions.projectRoot}/Dockerfile --build-arg POLARIS_APP_TYPE=slo --build-arg POLARIS_APP_NAME=${normalizedOptions.projectName} -t ${getContainerImageName(normalizedOptions)}-composed-metric-controller:latest .`,
                // eslint-disable-next-line max-len
                `docker build -f ./${normalizedOptions.projectRoot}/prediction-controller/Dockerfile -t ${getContainerImageName(normalizedOptions)}-prediction-controller:latest ./apps/${normalizedOptions.projectName}/prediction-controller`,
            ],
            parallel: false,
        },
    };
    addDeployTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

    addCommonWorkspaceRootFiles(host);
    addComposedMetricControllerFiles(host, normalizedOptions);

    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.getOrCreateControllerProject(normalizedOptions, PolarisCliProjectType.ComposedMetricController);
    polarisCliConfig.writeToFile();

    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateComposedMetricController;

function addComposedMetricControllerFiles(host: Tree, options: NormalizedPredictedMetricControllerGeneratorSchema): void {
    const compMetricNames = getComposedMetricTypeNames(options.compMetricType);

    const templateOptions = {
        ...compMetricNames,
        compMetricTypePkg: options.compMetricTypePkg,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        controllerProjectName: options.projectName,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        appsDir: options.appsDir,
        template: '',
    };

    generateFiles(host, path.join(__dirname, 'files/composed-metric-controller'), options.projectRoot, templateOptions);
    generateTypeScriptDockerfile(host, options);
}
