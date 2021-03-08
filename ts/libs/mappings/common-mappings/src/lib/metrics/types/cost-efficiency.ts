import { PolishedMetricParams, PolishedMetricType } from '@sloc/core';

/**
 * Represents a generic cost efficiency metric.
 *
 * The cost efficiency of a target workload is calculated as `performance / totalCost`.
 *
 * The `performance` part depends on the concrete implementation of the `CostEfficiencyMetric`, e.g.,
 * for REST APIs `performance` is usually the number of requests that are faster than a defined threshold.
 *
 * The `totalCost` part is retrieved using the `TotalCostMetricType`.
 */
export interface CostEfficiency {

    /**
     * The cost efficiency of the `SloTarget`.
     */
    costEfficiency: number;

    /**
     * The percentile of the `performance` metric samples that are above the defined threshold.
     */
    percentileAboveThreshold: number;

}

/**
 * The parameters for retrieving the cost efficiency metric.
 */
export interface CostEfficiencyParams extends PolishedMetricParams {

    /**
     * (optional) The name of the metric source that supplies the `totalCost` of the target workload.
     * The metric must supply the `TotalCostMetricType`.
     *
     * Set this, if you do not want to use the default total cost metric.
     */
    costMetricSourceName?: string;

}


/**
 * Represents the type of a generic cost efficiency metric.
 *
 * The cost efficiency of a target workload is calculated as `performance / totalCost`.
 *
 * The `performance` part depends on the concrete implementation of the `CostEfficiencyMetric`, e.g.,
 * for REST APIs `performance` is usually the number of requests that are faster than a defined threshold.
 *
 * The `totalCost` part is retrieved using the `TotalCostMetric` type.
 */
export class CostEfficiencyMetricType extends PolishedMetricType<CostEfficiency, CostEfficiencyParams> {

    readonly metricTypeName = 'metrics.sloc.github.io/CostEfficiency';

}
