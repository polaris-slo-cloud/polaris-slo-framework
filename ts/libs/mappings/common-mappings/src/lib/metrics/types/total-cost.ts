import { PolishedMetricType } from '@sloc/core';

/**
 * Describes the total cost for an `SloTarget`.
 */
export interface TotalCost {

    /**
     * The total cost per hour for the `SloTarget` at the current resource usage rate.
     */
    currentCostPerHour: number;

    /**
     * The total cost for the `SloTarget` accumulated in the current billing period up to this point.
     */
    accumulatedCostInPeriod: number;

}

/**
 * Polished metric type for describing the total cost for an `SloTarget`.
 */
export class TotalCostMetricType extends PolishedMetricType<TotalCost> {

    readonly metricTypeName = 'metrics.sloc.github.io/total-cost';

}
