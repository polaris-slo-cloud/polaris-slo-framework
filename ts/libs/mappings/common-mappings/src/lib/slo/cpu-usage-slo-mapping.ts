import { ObjectKind, PolarisType, SloCompliance, SloMappingBase, SloMappingInitData, SloMappingSpecBase, initSelf } from '@polaris-sloc/core';

export interface CpuUsageSloConfig {

    /**
     * The average CPU utilization that should be achieved across all instances of the target.
     */
    targetAvgCPUUtilizationPercentage: number;

}

export class CpuUsageSloMappingSpec extends SloMappingSpecBase<CpuUsageSloConfig, SloCompliance> {

    constructor(initData?: Partial<CpuUsageSloMappingSpec>) {
        super(initData);
        initSelf(this, initData);
    }

}

export class CpuUsageSloMapping extends SloMappingBase<CpuUsageSloMappingSpec> {

    constructor(initData?: SloMappingInitData<CpuUsageSloMapping>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'slo.sloc.github.io',
            version: 'v1',
            kind: 'CPUUsageSloMapping',
        });
        initSelf(this, initData);
    }

    @PolarisType(() => CpuUsageSloMappingSpec)
    spec: CpuUsageSloMappingSpec;

}
