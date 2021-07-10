import { NormalizedProjectGeneratorSchema } from '../../util';

export interface ElasticityStrategyControllerGeneratorSchema {
    name: string;
    eStratTypePkg: string;
    eStratType: string;
    tags?: string;
    directory?: string;
}

interface ElasticityStrategyControllerGeneratorNormalizedSchema extends NormalizedProjectGeneratorSchema, ElasticityStrategyControllerGeneratorSchema {
    projectDirectory: string;
    parsedTags: string[]
}
