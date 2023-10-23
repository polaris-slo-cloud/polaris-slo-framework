import * as child_process from 'child_process';
import * as path from 'path';
import { Generator, Tree, formatFiles, generateFiles, joinPathFragments, offsetFromRoot, readProjectConfiguration, updateProjectConfiguration } from '@nx/devkit';
import { ObjectKind } from '@polaris-sloc/core';
import { flushChanges } from 'nx/src/generators/tree';
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
    createAppProject,
    getComposedMetricTypeNames,
    getTempDir,
    getWorkspaceTsConfigPath,
    normalizeProjectGeneratorOptions,
    runCallbacksSequentially,
} from '../../util';
import { addCommonWorkspaceRootFiles, generateTypeScriptDockerfile } from '../common';
import { ComposedMetricControllerGeneratorNormalizedSchema, ComposedMetricControllerGeneratorSchema } from './schema';

/**
 * Generates a new Composed Metric Controller.
 */
const generateComposedMetricController: Generator<ComposedMetricControllerGeneratorSchema> = async (
    host: Tree,
    options: ComposedMetricControllerGeneratorSchema,
) => {
    const normalizedOptions = normalizeProjectGeneratorOptions(host, options);

    const nodeAppResult = await createAppProject(
        host,
        {
            projectName: options.name,
            directory: options.directory,
            tags: options.tags,
        },
    );

    const installPkgsFn = addPolarisDependenciesToPackageJson(host, {
        [NPM_PACKAGES.polaris.orchestrators.kubernetes]: VERSIONS.polaris,
        [NPM_PACKAGES.polaris.queryBackends.prometheus]: VERSIONS.polaris,
    });

    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    changeBuildDependencyBundling(projectConfig);
    addDockerBuildConfig(projectConfig, normalizedOptions);
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

function addComposedMetricControllerFiles(host: Tree, options: ComposedMetricControllerGeneratorNormalizedSchema): void {
    const compMetricNames = getComposedMetricTypeNames(options.compMetricType);
    const { group, kind } = extractCompMetricType(host, options, compMetricNames.compMetricType)

    const templateOptions = {
        ...compMetricNames,
        compMetricApiGroup: group,
        compMetricK8sResources: kind.toLowerCase(),
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

function extractCompMetricType(host: Tree, options: ComposedMetricControllerGeneratorNormalizedSchema, compMetricType: string): ObjectKind {
    const tempDir = getTempDir(options.name, 'gen-composed-metric-controller');
    generateAndWriteScripts(host, options.compMetricTypePkg, compMetricType, tempDir);

    // Run the gen-crds script.
    const scriptTsConfig = joinPathFragments(tempDir, 'tsconfig.json');
    const scriptTs = joinPathFragments(tempDir, 'gen-controller.ts');
    const result = child_process.spawnSync(
        'npx',
        [ 'ts-node', '--project', scriptTsConfig, scriptTs ],
        {
            cwd: host.root,
        },
    );

    const objectKindString = result.stdout.toString();
    return JSON.parse(objectKindString);
}

function generateAndWriteScripts(host: Tree, compMetricTypePkg: string, polarisType: string, tempDir: string): void {
    const tsConfigBase = getWorkspaceTsConfigPath(host);
    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(tempDir), tsConfigBase),
        compMetricTypePkg,
        polarisType,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/gen-composed-metric-controller-scripts'),
        tempDir,
        templateOptions,
    );

    const changes = host.listChanges().filter((change) => change.path.startsWith(tempDir));
    flushChanges(host.root, changes);
}
