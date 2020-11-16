import { KubeConfig } from '@kubernetes/client-node';
import { ApiObjectMetadata, SloTarget } from '@sloc/core';
import { initSlocKubernetes } from '@sloc/kubernetes';
import { isEqual as _isEqual } from 'lodash';
import { CpuUsageSloMapping, CpuUsageSloMappingSpec } from './app/model/cpu-usage-slo-mapping';
import { HorizontalElasticityStrategyKind } from './app/model/horizontal-elasticity-strategy-kind';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const slocRuntime = initSlocKubernetes(k8sConfig);

// There could be a specific init() function for every library, which could be used to register its custom types with the TransformationService.
slocRuntime.transformer.registerObjectKind(new CpuUsageSloMapping().objectKind, CpuUsageSloMapping);

const cpuSlo = new CpuUsageSloMapping({
    metadata: new ApiObjectMetadata({
        name: 'my-slo',
    }),
    spec: new CpuUsageSloMappingSpec({
        elasticityStrategy: new HorizontalElasticityStrategyKind(),
        targetRef: new SloTarget({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'twitter-clone',
        }),
        sloConfig: {
            targetAvgCPUUtilizationPercentage: 80,
        },
    }),
});

console.log('Initial SLOC object: ', cpuSlo);

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const orchSpecific = slocRuntime.transformer.transformToOrchestratorPlainObject(cpuSlo);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const slocObj = slocRuntime.transformer.transformToSlocObject(CpuUsageSloMapping, orchSpecific);
console.log('Parsed SLOC object: ', slocObj);

const objectsAreEqual = _isEqual(cpuSlo, slocObj);
console.log('Parsed SLOC object is equal to initial SLOC object: ', objectsAreEqual);

