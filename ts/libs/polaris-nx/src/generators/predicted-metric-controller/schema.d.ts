import { NormalizedProjectGeneratorSchema, ProjectGeneratorSchema } from '@polaris-sloc/polaris-nx';

export interface PredictedMetricControllerGeneratorSchema extends ProjectGeneratorSchema{
    compMetricTypePkg: string;
    compMetricType: string;
}

export interface NormalizedPredictedMetricControllerGeneratorSchema extends NormalizedProjectGeneratorSchema {}
