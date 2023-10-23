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
    getSloNames,
    getTempDir,
    getWorkspaceTsConfigPath,
    normalizeProjectGeneratorOptions,
    runCallbacksSequentially,
} from '../../util';
import { addCommonWorkspaceRootFiles, generateTypeScriptDockerfile } from '../common';
import { SloControllerGeneratorNormalizedSchema, SloControllerGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO Controller..
 */
const generateSloController: Generator<SloControllerGeneratorSchema> = async (host: Tree, options: SloControllerGeneratorSchema) => {
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
    addSloControllerFiles(host, normalizedOptions);

    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.getOrCreateControllerProject(normalizedOptions, PolarisCliProjectType.SloController);
    polarisCliConfig.writeToFile();

    await formatFiles(host);

    return runCallbacksSequentially(nodeAppResult, installPkgsFn);
};

export default generateSloController;

function addSloControllerFiles(host: Tree, options: SloControllerGeneratorNormalizedSchema): void {
    const sloNames = getSloNames(options.sloMappingType);
    const { group, kind } = extractSloType(host, options);

    const templateOptions = {
        ...sloNames,
        sloMappingTypeApiGroup: group,
        sloMappingK8sResources: kind.toLowerCase(),
        sloMappingTypePkg: options.sloMappingTypePkg,
        initPolarisLibFn: POLARIS_INIT_LIB_FN_NAME,
        controllerProjectName: options.projectName,
        offsetFromRoot: offsetFromRoot(options.projectRoot),
        appsDir: options.appsDir,
        template: '',
    };
    generateFiles(host, path.join(__dirname, 'files/slo-controller'), options.projectRoot, templateOptions);
    generateTypeScriptDockerfile(host, options);
}

function extractSloType(host: Tree, options: SloControllerGeneratorNormalizedSchema): ObjectKind {
    const tempDir = getTempDir(options.name, 'gen-slo-controller');
    generateAndWriteScripts(host, options.sloMappingTypePkg, options.sloMappingType, tempDir);

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

function generateAndWriteScripts(host: Tree, sloMappingTypePkg: string, polarisType: string, tempDir: string): void {
    const tsConfigBase = getWorkspaceTsConfigPath(host);
    const templateOptions = {
        tsConfigBase: joinPathFragments(offsetFromRoot(tempDir), tsConfigBase),
        sloMappingTypePkg,
        polarisType,
        template: '',
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/gen-slo-controller-scripts'),
        tempDir,
        templateOptions,
    );

    const changes = host.listChanges().filter((change) => change.path.startsWith(tempDir));
    flushChanges(host.root, changes);
}
