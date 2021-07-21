// This file provides common static configuration interfaces for elasticity strategies.

import { Resources } from '../../../model';

/**
 * Commonly used, optional, static configuration for an elasticity strategy that employs horizontal scaling.
 */
export interface HorizontalElasticityStrategyConfig {

    /**
     * The minimum number of replicas that the target workload must have.
     *
     * @default 1
     */
    minReplicas?: number;

    /**
     * The maximum number of replicas that the target workload may have.
     *
     * @default unlimited
     */
    maxReplicas?: number;

}

/**
 * Commonly used, optional, static configuration for an elasticity strategy that employs vertical scaling.
 */
export interface VerticalElasticityStrategyConfig {

    /** The minimum resources allowed for a single workload instance. */
    minResources: Resources;

    /** The maximum resources allowed for a single workload instance. */
    maxResources: Resources;

    /**
     * The percentage by which to increase the existing resources in a single scale up step.
     *
     * E.g., `scaleUpPercent: 10` means that the existing `memoryMib` and `milliCpu` values
     * will be increased by 10 percent in a single scale up step.
     *
     * @default 10
     */
    scaleUpPercent?: number;

    /**
     * The percentage by which to decrease the existing resources in a single scale down step.
     *
     * E.g., `scaleDownPercent: 10` means that the existing `memoryMib` and `milliCpu` values
     * will be decreased by 10 percent in a single scale down step.
     *
     * @default 10
     */
    scaleDownPercent?: number;

}
