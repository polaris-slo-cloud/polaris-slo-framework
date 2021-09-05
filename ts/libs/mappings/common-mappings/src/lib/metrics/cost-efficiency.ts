import { ComposedMetricMapping, ComposedMetricMappingSpec, ComposedMetricParams, ComposedMetricType, ObjectKind } from '@polaris-sloc/core';
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
     * The target threshold for the `performance` part of the cost efficiency equation.
     *
     * Depending on the specific cost efficiency metric implementation, the threshold may be considered as
     * a lower bound (`performance` samples should be above the threshold) or as an
     * upper bound (`performance` samples should be below the threshold).
     *
     * If the implementation of the metric relies on a bucketing mechanism (e.g., Prometheus histograms),
     * the set of allowed values may be limited.
     */
    targetThreshold: number;

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

    readonly metricTypeName = 'metrics.polaris-slo-cloud.github.io/cost-efficiency';

}

/**
 * Used to configure a cost efficiency composed metric controller to compute
 * its metric for a specific target.
 */
export class CostEfficiencyMetricMapping extends ComposedMetricMapping<ComposedMetricMappingSpec<CostEfficiencyParams>> {

    constructor(initData?: Partial<CostEfficiencyMetricMapping>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'metrics.polaris-slo-cloud.github.io',
            version: 'v1',
            kind: 'CostEfficiencyMetricMapping',
        });
    }

}
