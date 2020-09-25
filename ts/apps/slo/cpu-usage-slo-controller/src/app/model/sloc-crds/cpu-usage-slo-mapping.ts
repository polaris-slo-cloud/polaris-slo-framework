import { SloMapping } from './slo-mapping';
import { SlocCRD } from './sloc-crd';

export interface CpuUsageSloMappingSpec extends SloMapping {

    targetAvgCPUUtilizationPercentage: number;

}

export interface CpuUsageSloMapping extends SlocCRD<'CpuUsageSloMapping', CpuUsageSloMappingSpec> { }
