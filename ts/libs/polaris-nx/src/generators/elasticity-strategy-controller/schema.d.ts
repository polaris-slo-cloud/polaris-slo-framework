import { NormalizedProjectGeneratorSchema, ProjectGeneratorSchema } from '../../util';

export interface ElasticityStrategyControllerGeneratorSchema extends ProjectGeneratorSchema {
    eStratTypePkg: string;
    eStratType: string;
}

interface ElasticityStrategyControllerGeneratorNormalizedSchema extends NormalizedProjectGeneratorSchema, ElasticityStrategyControllerGeneratorSchema {}
