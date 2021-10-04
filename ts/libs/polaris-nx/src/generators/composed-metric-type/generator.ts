import * as path from 'path';
import { Generator, GeneratorCallback, Tree, formatFiles, generateFiles, joinPathFragments, names, readProjectConfiguration } from '@nrwl/devkit';
import {
    adaptTsConfigForPolaris,
    addExports,
    addPolarisDependenciesToPackageJson,
    createLibProject,
    getComposedMetricTypeNames,
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
    const compMetricNames = getComposedMetricTypeNames(normalizedOptions.className);
    const initFnFileAdded = addOrExtendInitFn(
        host,
        {
            ...normalizedOptions,
            className: compMetricNames.compMetricMapping,
        },
    );

    // Add exports to .ts files.
    addExports(host, normalizedOptions, initFnFileAdded);

    await formatFiles(host);

    return runCallbacksSequentially(...callbacks);
}

// Export the generator function as the default export to enable integration with Nx.
export default generateComposedMetricType;

function normalizeOptions(host: Tree, options: ComposedMetricTypeGeneratorSchema): ComposedMetricTypeGeneratorNormalizedSchema {
    const projectConfig = readProjectConfiguration(host, options.project);
    const normalizedNames = names(options.name);

    return {
        names: normalizedNames,
        className: `${normalizedNames.className}`,
        projectName: options.project,
        projectSrcRoot: projectConfig.sourceRoot,
        destDir: joinPathFragments('lib', options.directory),
        destDirInLib: options.directory,
        fileName: normalizedNames.fileName,
    };
}

/**
 * Generates the ComposedMetricType.
 */
 export function addComposedMetricTypeFile(host: Tree, options: ComposedMetricTypeGeneratorNormalizedSchema): void {
    const compMetricNames = getComposedMetricTypeNames(options.className);

    const templateOptions = {
        ...compMetricNames,
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
