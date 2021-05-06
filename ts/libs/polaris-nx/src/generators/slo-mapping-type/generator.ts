import {
    Generator,
    Tree,
    formatFiles,
    joinPathFragments,
} from '@nrwl/devkit';
import { addExportToIndex } from '../../util';
import { addFiles } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorSchema } from './schema';

/**
 * Main entry point for the SLO mapping type generator.
 */
const generatorFn: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);

    addFiles(host, normalizedOptions);

    // Export the contents of the new SLO mapping file from the library.
    const indexFile = joinPathFragments(normalizedOptions.projectSrcRoot, 'index.ts')
    const sloMappingFile = './' + joinPathFragments(normalizedOptions.destDir, normalizedOptions.fileNameWithSuffix)
    addExportToIndex(host, indexFile, sloMappingFile);

    await formatFiles(host);
}

export default generatorFn;
