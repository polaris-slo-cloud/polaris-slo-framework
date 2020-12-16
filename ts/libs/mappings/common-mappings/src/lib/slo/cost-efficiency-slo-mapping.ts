import { ObjectKind, SloCompliance, SloMappingBase, SloMappingInitData, SloMappingSpecBase, SlocType, initSelf } from '@sloc/core';
import { RestServiceTarget } from '../slo-targets';

export interface CostEfficiencySloConfig {

    responseTimeThresholdMs: number;

    targetCostEfficiency: number;

    minRequestsPercentile?: number;

}

export class CostEfficiencySloMappingSpec extends SloMappingSpecBase<CostEfficiencySloConfig, SloCompliance, RestServiceTarget> { }

export class CostEfficiencySloMapping extends SloMappingBase<CostEfficiencySloMappingSpec> {

    constructor(initData?: SloMappingInitData<CostEfficiencySloMapping>) {
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
