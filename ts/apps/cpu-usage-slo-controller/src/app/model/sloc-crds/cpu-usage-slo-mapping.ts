import { SlocCRD } from './sloc-crd';
import { SloMapping } from './slo-mapping';

export interface CpuUsageSloMappingSpec extends SloMapping {

    targetAvgCPUUtilizationPercentage: number;

}

export interface CpuUsageSloMapping extends SlocCRD<'CpuUsageSloMapping', CpuUsageSloMappingSpec> { }
