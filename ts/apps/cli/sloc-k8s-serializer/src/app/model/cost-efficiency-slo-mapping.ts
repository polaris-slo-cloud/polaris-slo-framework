import { ApiObject, ApiObjectMetadata, ObjectKind, ServiceLevelObjective, SloCompliance, SloMappingSpecBase, SloTarget, SlocRuntime, SlocType, initSelf } from '@sloc/core';
import { CostEfficiencySlo, CostEfficiencySloConfig } from '../cost-efficiency.slo';
import { HorizontalElasticityStrategyKind } from './horizontal-elasticity-strategy-kind';


export class CostEfficiencySloMappingSpec extends SloMappingSpecBase<CostEfficiencySloConfig, SloCompliance> {

    createSloInstance(slocRuntime: SlocRuntime): ServiceLevelObjective<CostEfficiencySloConfig, SloCompliance> {
        return new CostEfficiencySlo();
    }
}

export class CostEfficiencySloMapping extends ApiObject<CostEfficiencySloMappingSpec> {

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


export default new CostEfficiencySloMapping({
    metadata: new ApiObjectMetadata({ name: 'data-service-cost-efficiency' }),
    spec: new CostEfficiencySloMappingSpec({
        targetRef: new SloTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'data-service',
        }),
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        sloConfig: {
            responseTimeThresholdMs: 400,
            targetCostEfficiency: 1000,
            minRequestsPercentile: 90,
        },
    }),
});
