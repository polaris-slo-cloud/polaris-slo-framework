// This script generates the Kubernetes YAML for the SLO Mapping examples in `slo-mappings/examples`.
// In repositories created with the Polaris CLI, this script is automatically generated when running `polaris-cli serialize-slo-mapping [path of .ts file]`.
// To execute this script, open a terminal in the root folder of the TypeScript workspace and execute the following command:
// npx ts-node --project ./tools/scripts/tsconfig.json ./tools/scripts/serialize-slo-mappings.ts

import { KubeConfig } from '@kubernetes/client-node';
import { initPolarisLib } from '@polaris-sloc/common-mappings';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import * as Yaml from 'js-yaml';
import * as sloMapping from '../../slo-mappings/examples/cost-efficiency-cms';

// Extremely ugly way to disable logging until we add a logging library with support for logging levels.
const log = console.log;
console.log = () => {};

// Initialize the PolarisRuntime.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);
initPolarisLib(polarisRuntime);

// Transform the SloMapping instance into a plain orchestrator object and serialize it to YAML.
const orchSpecific = polarisRuntime.transformer.transformToOrchestratorPlainObject(sloMapping.default);
log(Yaml.dump(orchSpecific, { indent: 2 }));
