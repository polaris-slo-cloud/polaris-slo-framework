import { ObjectKind, PolarisType, SloCompliance, SloMappingBase, SloMappingInitData, SloMappingSpecBase, initSelf } from '@polaris-sloc/core';
import { RestServiceTarget } from '../slo-targets';

/**
 * The configuration of a Cost Efficiency SLO Mapping.
 */
export interface CostEfficiencySloConfig {

    /**
     * The response time threshold in milliseconds, below which all requests should be answered,
     * i.e., ideally all responses should be faster than this value.
     */
    responseTimeThresholdMs: 10 | 25 | 50 | 100 | 250 | 500 | 1000 | 2500 | 5000 | 10000;

    /**
     * The desired cost efficiency value.
     */
    targetCostEfficiency: number;

    /**
     * The minimum percentile of requests that should be faster than `responseTimeThresholdMs`.
     *
     * A low cost efficiency value can indicate either a) that the system cannot handle a very high load
     * or, b) that the load is very low and the system has too many resources.
     * The `minRequestsPercentile` is used to distinguish these two cases.
     *
     * If the cost efficiency is low and the number of requests faster than the threshold is below
     * this percentile, we know that we are dealing with case a), i.e., the SLO compliance percentage will be
     * above 100% (e.g., more resources are needed).
     *
     * Whereas, if the number of requests faster than the threshold is above this percentile, we know that
     * we are dealing with case b), i.e., the SLO compliance percentage will be below 100% (e.g., resources can be reduced).
     *
     * Default: `0.9`
     */
    minRequestsPercentile?: number;

}

/**
 * The spec for a `CostEfficiencySloMapping`.
 */
export class CostEfficiencySloMappingSpec extends SloMappingSpecBase<CostEfficiencySloConfig, SloCompliance, RestServiceTarget> { }

/**
 * The Cost Efficiency SLO is based on the *cost efficiency* of a REST service.
 *
 * The cost efficiency of a REST service is calculated as:
 * (number of requests per second served faster than a configured threshold)
 * divided by
 * (total cost of the service).
 */
export class CostEfficiencySloMapping extends SloMappingBase<CostEfficiencySloMappingSpec> {

    @PolarisType(() => CostEfficiencySloMappingSpec)
    spec: CostEfficiencySloMappingSpec;

    constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'slo.sloc.github.io',
            version: 'v1',
            kind: 'CostEfficiencySloMapping',
        });
        initSelf(this, initData);
    }

}
