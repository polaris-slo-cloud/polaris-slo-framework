import { ComposedMetricParams, ComposedMetricType } from '@polaris-sloc/core';
import { TotalCost } from './total-cost';

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
     * The percentile of the `performance` metric samples that are better than the defined threshold.
     */
    percentileBetterThanThreshold: number;

    /**
     * The total costs of the `SloTarget`.
     */
    totalCost: TotalCost;

}

/**
 * The parameters for retrieving the cost efficiency metric.
 */
export interface CostEfficiencyParams extends ComposedMetricParams {

    /**
     * The target threshold for the `performance` metric.
     *
     * Depending on the specific metric implementation, the threshold may be considered as
     * a lower bound (`performance` samples should be above the threshold) or as an
     * upper bound (`performance` samples should be below the threshold).
     */
    targetThreshold: number;

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
export class CostEfficiencyMetric extends ComposedMetricType<CostEfficiency, CostEfficiencyParams> {

    /** The singleton instance of this type. */
    static readonly instance = new CostEfficiencyMetric();

    readonly metricTypeName = 'metrics.sloc.github.io/cost-efficiency';

}
