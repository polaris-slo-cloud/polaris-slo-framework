// This file provides common static configuration interfaces for elasticity strategies.

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

    /** The minimum milli CPU count that is allowed for a single workload instance. */
    minMilliCpu?: number;

    /** The maximum milli CPU count that is allowed for a single workload instance. */
    maxMilliCpu?: number;

    /** The minimum MiB of memory that is allowed for a single workload instance. */
    minMemoryMiB?: number;

    /** The maximum MiB of memory that is allowed for a single workload instance. */
    maxMemoryMiB?: number;

}
