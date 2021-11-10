import { ElasticityStrategyNames, LibraryClassGeneratorSchema, NormalizedLibraryClassGeneratorSchema } from '../../util';

export interface ElasticityStrategyGeneratorSchema extends LibraryClassGeneratorSchema {}

export interface ElasticityStrategyGeneratorNormalizedSchema extends NormalizedLibraryClassGeneratorSchema {
    eStratNames: ElasticityStrategyNames;
}
