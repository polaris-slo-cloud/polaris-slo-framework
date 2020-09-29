import { ApiObject, ObjectKind, SloMappingSpecBase, SlocType, initSelf } from '@sloc/core';

export class CpuUsageSloMappingSpec extends SloMappingSpecBase {

    targetAvgCPUUtilizationPercentage: number;

    constructor(initData?: Partial<CpuUsageSloMappingSpec>) {
        super(initData);
        initSelf(this, initData);
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
