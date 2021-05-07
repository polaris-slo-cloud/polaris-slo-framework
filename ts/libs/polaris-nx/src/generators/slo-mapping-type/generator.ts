import {
    Generator,
    Tree,
    formatFiles,
    joinPathFragments,
} from '@nrwl/devkit';
import { adaptTsConfigForPolaris, addExportToIndex, addPolarisDependenciesToPackageJson } from '../../util';
import { addFiles } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorSchema } from './schema';

/**
 * Generates a new Polaris SLO mapping type.
 */
const generateSloMappingType: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);

    // Add required packages to package.json, if necessary.
    const installPkgsFn = addPolarisDependenciesToPackageJson(host);

    // Adapt tsconfig to allow decorators.
    adaptTsConfigForPolaris(host);

    // Generate the SLO mapping file.
    addFiles(host, normalizedOptions);

    // Export the contents of the new SLO mapping file from the library.
    const indexFile = joinPathFragments(normalizedOptions.projectSrcRoot, 'index.ts')
    const sloMappingFile = './' + joinPathFragments(normalizedOptions.destDir, normalizedOptions.fileNameWithSuffix)
    addExportToIndex(host, indexFile, sloMappingFile);

    await formatFiles(host);

    return installPkgsFn;
}

export default generateSloMappingType;
