import {
    Generator,
    GeneratorCallback,
    Tree,
    formatFiles,
    joinPathFragments,
    readProjectConfiguration,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/node';
import {
    POLARIS_INIT_FN_FILE_NAME,
    adaptLibModuleTypeForPolaris,
    adaptTsConfigForPolaris,
    addExportToIndex,
    addPolarisDependenciesToPackageJson,
    runCallbacksSequentially,
} from '../../util';
import { addOrExtendInitFn, addSloMappingTypeFile } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO mapping type.
 */
const generateSloMappingType: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const callbacks: GeneratorCallback[] = [];

    if (options.createLibProject) {
        callbacks.push(await createLibProject(host, options));
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

    await formatFiles(host);

    return runCallbacksSequentially(...callbacks);
}

// Export the generator function as the default export to enable integration with Nx.
export default generateSloMappingType;

/**
 * Creates a new library project for the SLO Mapping type.
 *
 * Throws an error if the project already exists.
 */
async function createLibProject(host: Tree, options: SloMappingTypeGeneratorSchema): Promise<GeneratorCallback> {
    let projectExists = false;
    try {
        projectExists = !!readProjectConfiguration(host, options.project);
    } catch (e) {}
    if (projectExists) {
        throw new Error(`Cannot create a new library project, because a project with the name ${options.project} already exists.`);
    }

    const ret = await libraryGenerator(
        host, {
            name: options.project,
            publishable: true,
            importPath: options.importPath,
        },
    );

    adaptLibModuleTypeForPolaris(host, options.project);
    return ret;
}

/**
 * Export the contents of the new SLO mapping file and, optionally the init-polaris-lib.ts file, from the library.
 */
function addExports(host: Tree, options: SloMappingTypeGeneratorNormalizedSchema, includeInitPolarisLib: boolean): void {
    const indexFile = joinPathFragments(options.projectSrcRoot, 'index.ts');

    if (includeInitPolarisLib) {
        const initFnFile = './' + joinPathFragments('lib', POLARIS_INIT_FN_FILE_NAME);
        addExportToIndex(host, indexFile, initFnFile);
    }

    const sloMappingFile = './' + joinPathFragments(options.destDir, options.fileNameWithSuffix);
    addExportToIndex(host, indexFile, sloMappingFile);
}
