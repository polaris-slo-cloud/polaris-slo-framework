import { KubeConfig } from '@kubernetes/client-node';
import { CostEfficiencySloMapping, initPolarisLib as initCommonMappingsLib } from '@polaris-sloc/common-mappings';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import * as Yaml from 'js-yaml';
import { isEqual as _isEqual } from 'lodash';
import { default as costEffSlo } from './app/cost-efficiency.slo';

const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

initCommonMappingsLib(polarisRuntime);

const sloMapping = costEffSlo;
const sloMappingType = CostEfficiencySloMapping;

console.log('Initial Polaris object: ', sloMapping);

const orchSpecific = polarisRuntime.transformer.transformToOrchestratorPlainObject(sloMapping);
console.log('Orchestrator-specific plain object: ', orchSpecific);

const polarisObj = polarisRuntime.transformer.transformToPolarisObject(sloMappingType, orchSpecific);
console.log('Parsed Polaris object: ', polarisObj);

const objectsAreEqual = _isEqual(sloMapping, polarisObj);
console.log('Parsed Polaris object is equal to initial Polaris object: ', objectsAreEqual);

console.log('Orchestrator-specific YAML:\n', Yaml.dump(orchSpecific, { indent: 2 }));
