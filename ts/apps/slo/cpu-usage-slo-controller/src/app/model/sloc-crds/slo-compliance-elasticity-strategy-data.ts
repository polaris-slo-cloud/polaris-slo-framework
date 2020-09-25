import { V1CrossVersionObjectReference } from '@kubernetes/client-node';

/**
 * Describes the data needed for an ElasticityStrategy that supports SloCompliance input.
 */
export interface SloComplianceElasticityStrategyData {

    targetRef: V1CrossVersionObjectReference;

    currSloCompliance: number;

    sloTargetCompliance?: number;

    tolerance?: number;

}
