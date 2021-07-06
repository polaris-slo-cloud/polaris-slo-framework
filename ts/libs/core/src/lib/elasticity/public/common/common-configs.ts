// This file provides common static configuration interfaces for elasticity strategies.

import { Resources } from '../../../model';

/**
 * Commonly used, optional, static configuration for an elasticity strategy that employs horizontal scaling.
 */
export interface HorizontalElasticityStrategyConfig {

    /**
     * The minium number of replicas that the target workload must have.
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

}
