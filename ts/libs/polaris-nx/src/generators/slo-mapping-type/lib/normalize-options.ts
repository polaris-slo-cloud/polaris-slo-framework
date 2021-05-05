import { Tree, getWorkspaceLayout, names } from '@nrwl/devkit';
import { NormalizedSchema, SloMappingTypeGeneratorSchema } from '../schema';


export function normalizeOptions(host: Tree, options: SloMappingTypeGeneratorSchema): NormalizedSchema {
    const name = names(options.name).fileName;
    const projectDirectory = options.directory
        ? `${names(options.directory).fileName}/${name}`
        : name;
    const projectName = projectDirectory.replace(new RegExp('/', 'g'), '-');
    const projectRoot = `${getWorkspaceLayout(host).libsDir}/${projectDirectory}`;

    return {
        ...options,
        projectName,
        projectRoot,
        projectDirectory,
    };
}
