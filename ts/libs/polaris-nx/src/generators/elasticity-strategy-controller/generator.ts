import * as child_process from 'child_process';
import * as path from 'path';
import {
    Generator,
    Tree,
    formatFiles,
    generateFiles,
    joinPathFragments,
    offsetFromRoot,
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nx/devkit';
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
    getElasticityStrategyNames,
    getTempDir,
    getWorkspaceTsConfigPath,
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
    const { group, kind } = extractEStratType(host, options)

    const templateOptions = {
        ...eStratNames,
        eStratTypeApiGroup: group,
        eStratK8sResources: kind.toLowerCase(),
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

function extractEStratType(host: Tree, options: ElasticityStrategyControllerGeneratorNormalizedSchema): ObjectKind {
    const tempDir = getTempDir(options.name, 'gen-elasticity-stratetgy-controller');
    generateAndWriteScripts(host, options.eStratTypePkg, options.eStratType, tempDir);

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

function generateAndWriteScripts(host: Tree, eStratTypePkg: string, polarisType: string, tempDir: string): void {
    const tsConfigBase = getWorkspaceTsConfigPath(host);
    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(tempDir), tsConfigBase),
        eStratTypePkg,
        polarisType,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/gen-elasticity-strategy-controller-scripts'),
        tempDir,
        templateOptions,
    );

    const changes = host.listChanges().filter((change) => change.path.startsWith(tempDir));
    flushChanges(host.root, changes);
}
