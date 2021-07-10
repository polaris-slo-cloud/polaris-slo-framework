import { NormalizedLibraryClassGeneratorSchema } from '../../util';

export interface ElasticityStrategyGeneratorSchema {
    name: string;
    project: string;
    directory: string;
    createLibProject: boolean;
    importPath?: string;
}

export interface ElasticityStrategyGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {}
