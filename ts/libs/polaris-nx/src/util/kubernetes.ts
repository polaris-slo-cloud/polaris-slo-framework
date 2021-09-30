import {
    ApiextensionsV1Api,
    CoreV1Api,
    CustomObjectsApi,
    KubeConfig,
    V1CustomResourceDefinition,
} from '@kubernetes/client-node';
import { SloMappingBase } from '@polaris-sloc/core';
import { snakeCase } from 'change-case';

export async function readKubernetesSecret(kubeConfig: KubeConfig, name: string, namespace: string, key: string): Promise<string> {
    const client = kubeConfig.makeApiClient(CoreV1Api);
    const secret = await client.readNamespacedSecret(name, namespace);
    const secretData = secret.body.data[key];
    return Buffer.from(secretData, 'base64').toString('binary');
}

export function createKubeConfig(): KubeConfig {
    const kubeConfig = new KubeConfig();
    kubeConfig.loadFromDefault();
    return kubeConfig;
}

function convertLabelsToSelector(labels: Record<string, string>): string {
    let labelSelector = '';
    const numLabels = Object.keys(labels).length;
    let index = 0;

    // eslint-disable-next-line guard-for-in
    for (const key in labels) {
        if (index === numLabels - 1) {
            labelSelector += `${key}=${labels[key]}`;
        } else if (numLabels > 1) {
            labelSelector += `${key}=${labels[key]},`;
        } else {
            labelSelector += `${key}=${labels[key]}`;
        }
        index++;
    }
    return labelSelector;
}

export interface PrometheusComposedMetric {
    sloName: string;
    sloKind: string;
    timeSeriesName: string;
    targetGvk: string;
    targetNamespace: string;
    targetName: string;
    metricPropKeys: string[];
}

async function getSloMappingObjects(crd: V1CustomResourceDefinition, customObjectsApi: CustomObjectsApi): Promise<SloMappingBase<any>[]> {
    const group = crd.spec.group;
    const version = crd.spec.versions[0].name;
    const plural = crd.spec.names.plural;
    const sloMapping = await customObjectsApi.listClusterCustomObject(group, version, plural);

    const body: any = sloMapping.body;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    return body.items;
}

function buildLabels(sloMappingObject: SloMappingBase<any>, crd: V1CustomResourceDefinition): Record<string, string> {
    return {
        'polaris-slo-cloud.github.io/owner-api-group': crd.spec.group,
        'polaris-slo-cloud.github.io/owner-api-version': crd.spec.versions[0].name,
        'polaris-slo-cloud.github.io/owner-kind': crd.spec.names.kind,
        'polaris-slo-cloud.github.io/owner-name': sloMappingObject.metadata.name,
    };
}

export async function listAllComposedMetrics(kubeConfig: KubeConfig): Promise<[SloMappingBase<any>, PrometheusComposedMetric[]][]> {
    const sloGroup = 'slo.polaris-slo-cloud.github.io';
    const metricsGroup = 'metrics.polaris-slo-cloud.github.io';
    const composedMetricsPerSlo: [SloMappingBase<any>, PrometheusComposedMetric[]][] = [];
    const crds = [];
    const metricsVersion = 'v1';
    const apiextensionsV1Api = kubeConfig.makeApiClient(ApiextensionsV1Api);
    const customObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

    const response = await apiextensionsV1Api.listCustomResourceDefinition();
    const allCrds = response.body;

// filter crds that belong to slo group
    for (const crdsKey of allCrds.items) {
        const group = crdsKey.spec.group;
        if (group === sloGroup) {
            crds.push(crdsKey);
        }
    }

    for (const crd of crds) {
        const objects = await getSloMappingObjects(crd, customObjectsApi);
        for (const sloObject of objects) {
            const labels = buildLabels(sloObject, crd);
            const composedMetrics = await listComposedMetricsWithLabels(kubeConfig, metricsGroup, metricsVersion, labels);
            composedMetricsPerSlo.push([sloObject, composedMetrics]);
        }
    }

    return composedMetricsPerSlo;
}

// get all metric mapping crds
async function listComposedMetricsWithLabels(kubeConfig: KubeConfig, group: string, version: string,
                                             labels: Record<string, string>):Promise<PrometheusComposedMetric[]> {
    const apiextensionsV1Api = kubeConfig.makeApiClient(ApiextensionsV1Api);
    const customObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

    const crdResponse = await apiextensionsV1Api.listCustomResourceDefinition();
    const allCrds = crdResponse.body;
    const crds = [];
    // filter all crds that match our group
    for (const crd of allCrds.items) {
        const crdGroup = crd.spec.group;
        if (crdGroup === group) {
            crds.push(crd);
        }
    }
    const labelSelector = convertLabelsToSelector(labels);
    // get for each slo mapping object the metric mappings
    const metricMappings = [];
    for (const crd of crds) {
        const plural = crd.spec.names.plural;
        const response = await customObjectsApi.listClusterCustomObject(group, version, plural, 'true', undefined, '', labelSelector);

        const body: any = response.body;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const items = body.items;
        for (const item of items) {
            metricMappings.push(item);
        }
    }

    const prometheusMetrics = [];

    // convert each metric mapping into a PrometheusComposedMetric
    for (const metricMapping of metricMappings) {
        /* eslint-disable @typescript-eslint/no-unsafe-member-access */
        /* eslint-disable @typescript-eslint/restrict-template-expressions */
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        const obj = {
            sloName: metricMapping.metadata.labels['polaris-slo-cloud.github.io/owner-name'],
            sloKind: metricMapping.metadata.labels['polaris-slo-cloud.github.io/owner-kind'],
            timeSeriesName: `polaris_composed_${snakeCase(metricMapping.apiVersion)}_${snakeCase(metricMapping.kind.replace('MetricMapping', ''))}`,
            targetGvk: `${metricMapping.spec.targetRef.apiVersion}/${metricMapping.spec.targetRef.kind}`,
            targetNamespace: metricMapping.metadata.namespace,
            targetName: metricMapping.spec.targetRef.name,
            // TODO replace this when finding a way to get metric prop keys for MetricMapping
            metricPropKeys: ['costEfficiency', 'percentileBetterThanThreshold', 'totalCost.currentCostPerHour', 'totalCost.accumulatedCostInPeriod'],
        };
        prometheusMetrics.push(obj);
    }
    return prometheusMetrics;
}
