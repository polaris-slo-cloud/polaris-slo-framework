import { PolishedMetricType } from '@sloc/core';

export interface TotalCost {

}


export class TotalCostMetricType extends PolishedMetricType<TotalCost> {

    readonly metricTypeName = 'metrics.sloc.github.io/TotalCost';

}
