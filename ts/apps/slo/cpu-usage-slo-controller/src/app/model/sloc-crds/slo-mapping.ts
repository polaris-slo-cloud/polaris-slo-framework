import { V1CrossVersionObjectReference } from '@kubernetes/client-node';
import { ElasticityStrategyKind } from './elasticity-strategy-kind';

/**
 * Base interface for SloMappings.
 */
export interface SloMapping {

    /** Specifies the target on which to execute the elasticity strategy. */
    targetRef: V1CrossVersionObjectReference;

    /** Specifies the type of ElasticityStrategy to use for this SLO mapping. */
    elasticityStrategy: ElasticityStrategyKind;

}
