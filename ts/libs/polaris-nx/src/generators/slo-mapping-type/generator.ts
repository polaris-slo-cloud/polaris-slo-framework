import {
    Generator,
    Tree,
    addProjectConfiguration,
    formatFiles,
} from '@nrwl/devkit';
import { addFiles } from './lib/add-files';
import { normalizeOptions } from './lib/normalize-options';
import { SloMappingTypeGeneratorSchema } from './schema';


const generatorFn: Generator<SloMappingTypeGeneratorSchema> = async (host: Tree, options: SloMappingTypeGeneratorSchema) => {
    const normalizedOptions = normalizeOptions(host, options);
    addProjectConfiguration(
        host,
        normalizedOptions.projectName,
        {
            root: normalizedOptions.projectRoot,
            projectType: 'library',
            sourceRoot: `${normalizedOptions.projectRoot}/src`,
            targets: {
                build: {
                    executor: '@polaris-sloc/polaris-nx:build',
                },
            },
        },
    );
    addFiles(host, normalizedOptions);
    await formatFiles(host);
}

export default generatorFn;
