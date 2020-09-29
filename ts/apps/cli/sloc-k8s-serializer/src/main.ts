import { ApiObjectMetadata, ElasticityStrategyKind, ObjectReference } from '@sloc/core';
import { initSlocKubernetes } from '@sloc/kubernetes';
import { isEqual as _isEqual } from 'lodash';
import { CpuUsageSloMapping, CpuUsageSloMappingSpec } from './app/model/cpu-usage-slo-mapping';

const slocRuntime = initSlocKubernetes();

const cpuSlo = new CpuUsageSloMapping({
    metadata: new ApiObjectMetadata({
        name: 'my-slo',
    }),
    spec: new CpuUsageSloMappingSpec({
        elasticityStrategy: new ElasticityStrategyKind({
            group: 'elasticity.sloc.github.io',
            version: 'v1',
            kind: 'HorizontalElasticityStrategy',
        }),
        targetRef: new ObjectReference({
            group: 'apps',
            version: 'v1',
            kind: 'Deployment',
            name: 'twitter-clone',
        }),
        targetAvgCPUUtilizationPercentage: 80,
    }),
});

console.log('Initial SLOC object: ', cpuSlo);

const orchSpecific = slocRuntime.transformer.transformToOrchestratorPlainObject(cpuSlo);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const slocObj = slocRuntime.transformer.transformToSlocObject(CpuUsageSloMapping, orchSpecific);
console.log('Parsed SLOC object: ', slocObj);

const objectsAreEqual = _isEqual(cpuSlo, slocObj);
console.log('Parsed SLOC object is equal to initial SLOC object: ', objectsAreEqual);

