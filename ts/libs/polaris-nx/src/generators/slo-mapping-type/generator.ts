import {
    Generator,
    Tree,
    formatFiles,
    joinPathFragments,
} from '@nrwl/devkit';
import { POLARIS_INIT_FN_FILE_NAME, adaptTsConfigForPolaris, addExportToIndex, addPolarisDependenciesToPackageJson } from '../../util';
import { addOrExtendInitFn, addSloMappingTypeFile } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorNormalizedSchema, SloMappingTypeGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO mapping type.
 */
const generateSloMappingType: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);

    // Add required packages to package.json, if necessary.
    const installPkgsFn = addPolarisDependenciesToPackageJson(host);

    // Adapt tsconfig to allow decorators.
    adaptTsConfigForPolaris(host);

    // Generate the SLO mapping and the init-polaris-lib files.
    addSloMappingTypeFile(host, normalizedOptions);
    const initFnFileAdded = addOrExtendInitFn(host, normalizedOptions);

    // Add exports to .ts files.
    addExports(host, normalizedOptions, initFnFileAdded);

    await formatFiles(host);

    return installPkgsFn;
}

export default generateSloMappingType;

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
