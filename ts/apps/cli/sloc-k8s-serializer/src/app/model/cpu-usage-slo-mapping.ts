import { ApiObject, ObjectKind, ServiceLevelObjective, SloCompliance, SloMappingSpecBase, SlocRuntime, SlocType, initSelf } from '@sloc/core';

export interface CpuUsageSloConfig {

    targetAvgCPUUtilizationPercentage: number;

}

export class CpuUsageSloMappingSpec extends SloMappingSpecBase<CpuUsageSloConfig, SloCompliance> {

    constructor(initData?: Partial<CpuUsageSloMappingSpec>) {
        super(initData);
        initSelf(this, initData);
    }

    createSloInstance(slocRuntime: SlocRuntime): ServiceLevelObjective<this, any> {
        throw new Error('Method not implemented.');
    }

}

export class CpuUsageSloMapping extends ApiObject<CpuUsageSloMappingSpec> {

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
