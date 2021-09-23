import { NormalizedLibraryClassGeneratorSchema } from '../../util';

export interface ComposedMetricTypeGeneratorSchema {
    name: string;
    project: string;
    directory: string;
    createLibProject: boolean;
    importPath?: string;
}

export interface ComposedMetricTypeGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {}
