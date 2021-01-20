import { KubeConfig } from '@kubernetes/client-node';
import { CostEfficiencySloMapping, CpuUsageSloMapping, initSlocLib as initCommonMappingsLib } from '@sloc/common-mappings';
import { initSlocKubernetes } from '@sloc/kubernetes';
import * as Yaml from 'js-yaml';
import { isEqual as _isEqual } from 'lodash';
import { default as costEffSlo } from './app/cost-efficiency.slo';
import { default as cpuSlo } from './app/cpu-usage-slo';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const slocRuntime = initSlocKubernetes(k8sConfig);

initCommonMappingsLib(slocRuntime);

const sloMapping = costEffSlo;
const sloMappingType = CostEfficiencySloMapping;

console.log('Initial SLOC object: ', sloMapping);

const orchSpecific = slocRuntime.transformer.transformToOrchestratorPlainObject(sloMapping);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const slocObj = slocRuntime.transformer.transformToSlocObject(sloMappingType, orchSpecific);
console.log('Parsed SLOC object: ', slocObj);

const objectsAreEqual = _isEqual(sloMapping, slocObj);
console.log('Parsed SLOC object is equal to initial SLOC object: ', objectsAreEqual);

console.log('Orchestrator-specific YAML:\n', Yaml.dump(orchSpecific, { indent: 2 }));
