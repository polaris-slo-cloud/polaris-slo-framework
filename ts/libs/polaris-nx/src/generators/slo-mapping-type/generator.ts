import { Generator, GeneratorCallback, Tree, formatFiles, readProjectConfiguration, updateProjectConfiguration } from '@nx/devkit';
import {
    PolarisCliConfig,
    adaptTsConfigForPolaris,
    addExports,
    addGenCrdsTarget,
    addPolarisDependenciesToPackageJson,
    createLibProject,
    runCallbacksSequentially,
} from '../../util';
import { addOrExtendInitFn } from '../common';
import { addSloMappingTypeFile } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO mapping type.
 */
const generateSloMappingType: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const callbacks: GeneratorCallback[] = [];

    if (options.createLibProject) {
        callbacks.push(await createLibProject(host, { projectName: options.project, importPath: options.importPath }));
    }

    const normalizedOptions = normalizeOptions(host, options);

    // Add required packages to package.json, if necessary.
    callbacks.push(addPolarisDependenciesToPackageJson(host));

    // Adapt tsconfig to allow decorators.
    adaptTsConfigForPolaris(host);

    // Generate the SLO mapping and the init-polaris-lib files.
    addSloMappingTypeFile(host, normalizedOptions);
    const initFnFileAdded = addOrExtendInitFn(host, normalizedOptions);

    // Add exports to .ts files.
    addExports(host, normalizedOptions, initFnFileAdded);

    // Register the new type for CRD generation.
    const polarisCliConfig = PolarisCliConfig.readFromFile(host);
    polarisCliConfig.registerPolarisTypeAsCrd(normalizedOptions, normalizedOptions.sloNames.sloMappingType);
    polarisCliConfig.writeToFile();

    // Add the gen-crds target if it doesn't exist.
    const projectConfig = readProjectConfiguration(host, normalizedOptions.projectName);
    addGenCrdsTarget(projectConfig, normalizedOptions);
    updateProjectConfiguration(host, normalizedOptions.projectName, projectConfig);

    await formatFiles(host);

    return runCallbacksSequentially(...callbacks);
};

// Export the generator function as the default export to enable integration with Nx.
export default generateSloMappingType;
