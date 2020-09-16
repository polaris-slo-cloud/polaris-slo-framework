import { V1CrossVersionObjectReference } from '@kubernetes/client-node';
import { SlocCRD } from './sloc-crd';

export interface CpuUsageSloApplicationSpec {

    targetRef: V1CrossVersionObjectReference;

    targetAvgCPUUtilizationPercentage: number;

}

export interface CpuUsageSloApplication extends SlocCRD<'CPUUsageSloApplication', CpuUsageSloApplicationSpec> { }
