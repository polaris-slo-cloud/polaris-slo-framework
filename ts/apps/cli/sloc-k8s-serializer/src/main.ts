import { KubeConfig } from '@kubernetes/client-node';
import { CpuUsageSloMapping, CpuUsageSloMappingSpec, HorizontalElasticityStrategyKind, initSlocLib as initCommonMappingsLib } from '@sloc/common-mappings';
import { ApiObjectMetadata, SloTarget } from '@sloc/core';
import { initSlocKubernetes } from '@sloc/kubernetes';
import * as Yaml from 'js-yaml';
import { isEqual as _isEqual } from 'lodash';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const slocRuntime = initSlocKubernetes(k8sConfig);

initCommonMappingsLib(slocRuntime);

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

const orchSpecific = slocRuntime.transformer.transformToOrchestratorPlainObject(cpuSlo);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const slocObj = slocRuntime.transformer.transformToSlocObject(CpuUsageSloMapping, orchSpecific);
console.log('Parsed SLOC object: ', slocObj);

const objectsAreEqual = _isEqual(cpuSlo, slocObj);
console.log('Parsed SLOC object is equal to initial SLOC object: ', objectsAreEqual);

console.log('Orchestrator-specific YAML:\n', Yaml.dump(orchSpecific, { indent: 2 }));
