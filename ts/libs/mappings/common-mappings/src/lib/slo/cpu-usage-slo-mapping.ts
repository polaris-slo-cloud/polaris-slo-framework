import { ObjectKind, SloCompliance, SloMappingBase, SloMappingSpecBase, SlocType, initSelf } from '@sloc/core';

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

    constructor(initData?: Partial<Omit<CpuUsageSloMapping, 'objectKind'>>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'slo.sloc.github.io',
            version: 'v1',
            kind: 'CPUUsageSloMapping',
        });
        initSelf(this, initData);
    }

    @SlocType(() => CpuUsageSloMappingSpec)
    spec: CpuUsageSloMappingSpec;

}
