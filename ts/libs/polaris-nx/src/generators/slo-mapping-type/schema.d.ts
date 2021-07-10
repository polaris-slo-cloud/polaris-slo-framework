import { NormalizedLibraryClassGeneratorSchema } from '../../util';

export interface SloMappingTypeGeneratorSchema {
    name: string;
    project: string;
    directory: string;
    createLibProject: boolean;
    importPath?: string;
}

export interface SloMappingTypeGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {}
