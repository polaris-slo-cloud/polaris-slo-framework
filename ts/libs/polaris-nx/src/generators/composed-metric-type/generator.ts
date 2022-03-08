import * as path from 'path';
import {
    Generator,
    GeneratorCallback,
    Tree,
    formatFiles,
    generateFiles,
    joinPathFragments,
    names,
    readProjectConfiguration,
    updateProjectConfiguration,
} from '@nrwl/devkit';
import {
    PolarisCliConfig,
    adaptTsConfigForPolaris,
    addExports,
    addGenCrdsTarget,
    addPolarisDependenciesToPackageJson,
    createLibProject,
    getComposedMetricTypeNames,
    getProjectSrcRoot,
    runCallbacksSequentially,
} from '../../util';
import { addOrExtendInitFn } from '../common';
import { ComposedMetricTypeGeneratorNormalizedSchema, ComposedMetricTypeGeneratorSchema } from './schema';

/**
 * Generates a new Polaris ComposedMetricType.
 */
const generateComposedMetricType: Generator<ComposedMetricTypeGeneratorSchema> = async (host: Tree, options: ComposedMetricTypeGeneratorSchema) => {
    const callbacks: GeneratorCallback[] = [];

    if (options.createLibProject) {
        callbacks.push(await createLibProject(host, { projectName: options.project, importPath: options.importPath }));
    }

    const normalizedOptions = normalizeOptions(host, options);

    // Add required packages to package.json, if necessary.
    callbacks.push(addPolarisDependenciesToPackageJson(host));

    // Adapt tsconfig to allow decorators.
    adaptTsConfigForPolaris(host);

    // Generate the ComposedMetricType and the init-polaris-lib files.
    addComposedMetricTypeFile(host, normalizedOptions);
    const initFnFileAdded = addOrExtendInitFn(
        host,
        {
            ...normalizedOptions,
            className: normalizedOptions.compMetricNames.compMetricMapping,
        },
    );

    // Add exports to .ts files.
    addExports(host, normalizedOptions, initFnFileAdded);

    // Register the new type for CRD generation.
    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.registerPolarisTypeAsCrd(normalizedOptions, normalizedOptions.compMetricNames.compMetricMapping);
    polarisCliConfig.writeToFile();

    // Add the gen-crds target if it doesn't exist.
    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    addGenCrdsTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

    await formatFiles(host);

    return runCallbacksSequentially(...callbacks);
}

// Export the generator function as the default export to enable integration with Nx.
export default generateComposedMetricType;

function normalizeOptions(host: Tree, options: ComposedMetricTypeGeneratorSchema): ComposedMetricTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);
    const compMetricNames = getComposedMetricTypeNames(normalizedNames.className);

    return {
        names: normalizedNames,
        className: `${normalizedNames.className}`,
        projectName: options.project,
        projectSrcRoot: getProjectSrcRoot(projectConfig),
        destDir: joinPathFragments('lib', options.directory),
        destDirInLib: options.directory,
        fileName: compMetricNames.compMetricFileName,
        compMetricNames,
    };
}

/**
 * Generates the ComposedMetricType.
 */
 export function addComposedMetricTypeFile(host: Tree, options: ComposedMetricTypeGeneratorNormalizedSchema): void {
    const templateOptions = {
        ...options.compMetricNames,
        fileName: options.fileName,
        template: '', // Used to replace '__template__' with an empty string in file names.
    };

    generateFiles(
        host,
        path.join(__dirname, 'files/composed-metric-type'),
        joinPathFragments(options.projectSrcRoot, options.destDir),
        templateOptions,
    );
}
