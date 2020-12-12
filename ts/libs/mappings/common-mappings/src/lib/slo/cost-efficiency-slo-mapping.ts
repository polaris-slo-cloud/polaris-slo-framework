import { ObjectKind, SloCompliance, SloMappingBase, SloMappingSpecBase, SlocType, initSelf } from '@sloc/core';

export interface CostEfficiencySloConfig {

    responseTimeThresholdMs: number;

    targetCostEfficiency: number;

    minRequestsPercentile?: number;

}

export class CostEfficiencySloMappingSpec extends SloMappingSpecBase<CostEfficiencySloConfig, SloCompliance> { }

export class CostEfficiencySloMapping extends SloMappingBase<CostEfficiencySloMappingSpec> {

    constructor(initData?: Partial<Omit<CostEfficiencySloMapping, 'objectKind'>>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'slo.sloc.github.io',
            version: 'v1',
            kind: 'CostEfficiencySloMapping',
        });
        initSelf(this, initData);
    }

    @SlocType(() => CostEfficiencySloMappingSpec)
    spec: CostEfficiencySloMappingSpec;

}
