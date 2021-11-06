import { KubeConfig } from '@kubernetes/client-node';
import {
    CostEfficiencyMetricMapping,
    CostEfficiencySloMapping,
    CpuUsageSloMapping,
    HorizontalElasticityStrategy,
    VerticalElasticityStrategy,
    initPolarisLib as initPolarisTargetLib,
} from '@polaris-sloc/common-mappings';
import { PolarisConstructor } from '@polaris-sloc/core';
import { initPolarisKubernetes } from '@polaris-sloc/kubernetes';
import { CustomResourceDefinitionWriter } from '@polaris-sloc/schema-gen';

const OUT_DIR = 'crds';
const TS_CONFIG_FILE = './tsconfig.base.json';
const TS_INDEX_FILE = 'libs/mappings/common-mappings/src/index.ts';
const POLARIS_TYPES: PolarisConstructor<any>[] = [
    HorizontalElasticityStrategy,
    VerticalElasticityStrategy,
    CostEfficiencyMetricMapping,
    CostEfficiencySloMapping,
    CpuUsageSloMapping,
];

// Initialize the PolarisRuntime.
const k8sConfig = new KubeConfig();
k8sConfig.loadFromDefault();
const polarisRuntime = initPolarisKubernetes(k8sConfig);

// Initialize the library, from whose types we want to create the CRDs.
initPolarisTargetLib(polarisRuntime);

const crdWriter = new CustomResourceDefinitionWriter(polarisRuntime);

crdWriter.generateAndWriteCrds({
    tsConfig: TS_CONFIG_FILE,
    tsIndexFile: TS_INDEX_FILE,
    outDir: OUT_DIR,
    polarisTypes: POLARIS_TYPES,
})
.then(writtenFiles => {
    console.log('Successfully generated CRDs and saved to the following files: ', writtenFiles)
})
.catch(err => console.error(err));
