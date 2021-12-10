import { NormalizedProjectGeneratorSchema, ProjectGeneratorSchema } from '../../util';

export interface PredictedMetricControllerGeneratorSchema extends ProjectGeneratorSchema {
    compMetricTypePkg: string;
    compMetricType: string;
}

export interface NormalizedPredictedMetricControllerGeneratorSchema extends NormalizedProjectGeneratorSchema, PredictedMetricControllerGeneratorSchema {}
