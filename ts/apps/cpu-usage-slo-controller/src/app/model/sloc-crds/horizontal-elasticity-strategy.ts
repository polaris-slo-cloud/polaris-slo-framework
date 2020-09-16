import { V1CrossVersionObjectReference } from '@kubernetes/client-node';
import { SlocCRD } from './sloc-crd';

export interface HorizontalElasticityStrategySpec {

    targetRef: V1CrossVersionObjectReference;

    currSloCompliance: number;

    sloTargetCompliance?: number;

    tolerance?: number;

}

export interface HorizontalElasticityStrategy extends SlocCRD<'HorizontalElasticityStrategy', HorizontalElasticityStrategySpec> { }
