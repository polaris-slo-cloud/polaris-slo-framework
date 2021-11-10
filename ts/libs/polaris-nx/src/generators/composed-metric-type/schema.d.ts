import { ComposedMetricTypeNames, LibraryClassGeneratorSchema, NormalizedLibraryClassGeneratorSchema } from '../../util';

export interface ComposedMetricTypeGeneratorSchema extends LibraryClassGeneratorSchema {}

export interface ComposedMetricTypeGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {
    compMetricNames: ComposedMetricTypeNames;
}
