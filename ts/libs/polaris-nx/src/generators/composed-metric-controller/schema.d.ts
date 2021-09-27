import { NormalizedProjectGeneratorSchema, ProjectGeneratorSchema } from '../../util';

export interface ComposedMetricControllerGeneratorSchema extends ProjectGeneratorSchema {
    compMetricTypePkg: string;
    compMetricType: string;
}

export interface ComposedMetricControllerGeneratorNormalizedSchema extends NormalizedProjectGeneratorSchema, ComposedMetricControllerGeneratorSchema {}
