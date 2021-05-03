import { KubeConfig } from '@kubernetes/client-node';
import { CostEfficiencySloMapping, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import * as Yaml from 'js-yaml';
import { isEqual as _isEqual } from 'lodash';
import { default as costEffSlo } from './app/cost-efficiency.slo';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const slocRuntime = initPolarisKubernetes(k8sConfig);

initCommonMappingsLib(slocRuntime);

const sloMapping = costEffSlo;
const sloMappingType = CostEfficiencySloMapping;

console.log('Initial Polaris object: ', sloMapping);

const orchSpecific = slocRuntime.transformer.transformToOrchestratorPlainObject(sloMapping);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const slocObj = slocRuntime.transformer.transformToPolarisObject(sloMappingType, orchSpecific);
console.log('Parsed Polaris object: ', slocObj);

const objectsAreEqual = _isEqual(sloMapping, slocObj);
console.log('Parsed Polaris object is equal to initial Polaris object: ', objectsAreEqual);

console.log('Orchestrator-specific YAML:\n', Yaml.dump(orchSpecific, { indent: 2 }));
