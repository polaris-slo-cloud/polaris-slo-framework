import { V1CrossVersionObjectReference } from '@kubernetes/client-node';
import { SlocCRD } from './sloc-crd';

export interface CpuUsageSloMappingSpec {

    targetRef: V1CrossVersionObjectReference;

    targetAvgCPUUtilizationPercentage: number;

}

export interface CpuUsageSloMapping extends SlocCRD<'CpuUsageSloMapping', CpuUsageSloMappingSpec> { }
