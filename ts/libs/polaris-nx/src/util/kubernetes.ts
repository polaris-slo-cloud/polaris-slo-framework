import {
    ApiextensionsV1Api,
    CoreV1Api,
    CustomObjectsApi,
    KubeConfig,
    KubernetesObject,
    KubernetesObjectApi,
    RbacAuthorizationV1Api,
    V1ClusterRole,
    V1ClusterRoleBinding,
    V1CustomResourceDefinition,
} from '@kubernetes/client-node';
import { Tree } from '@nx/devkit';
import { SloMappingBase } from '@polaris-sloc/core';
import { camelCase, snakeCase } from 'change-case';
import { loadAll } from 'js-yaml';
import { flushChanges } from 'nx/src/generators/tree';
import { DEFAULT_CONFIG as TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG, createGenerator } from 'ts-json-schema-generator';
import { getTempDir } from '.';

const TS_CONFIG_FILE = './tsconfig.base.json';

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

async function getSloMappingObjects(crd: V1CustomResourceDefinition, customObjectsApi: CustomObjectsApi, namespace: string): Promise<SloMappingBase<any>[]> {
    const group = crd.spec.group;
    const version = crd.spec.versions[0].name;
    const plural = crd.spec.names.plural;
    const sloMappings = await customObjectsApi.listClusterCustomObject(group, version, plural);

    const body: any = sloMappings.body;
    const relevantMappings = [];
    /* eslint-disable @typescript-eslint/no-unsafe-member-access */
    for (const sloMapping of body.items) {
        if (sloMapping.metadata.namespace === namespace) {
            relevantMappings.push(sloMapping);
        }
    }
    return relevantMappings;
}

/* eslint-disable @typescript-eslint/naming-convention */
function buildLabels(sloMappingObject: SloMappingBase<any>, crd: V1CustomResourceDefinition): Record<string, string> {
    return {
        'polaris-slo-cloud.github.io/owner-api-group': crd.spec.group,
        'polaris-slo-cloud.github.io/owner-api-version': crd.spec.versions[0].name,
        'polaris-slo-cloud.github.io/owner-kind': crd.spec.names.kind,
        'polaris-slo-cloud.github.io/owner-name': sloMappingObject.metadata.name,
    };
}
/* eslint-enable @typescript-eslint/naming-convention */

export async function listAllComposedMetrics(
    composedMetricTypePkg: string,
    composedMetricType: string,
    requiredNamespace: string,
    kubeConfig: KubeConfig,
    host: Tree,
): Promise<[SloMappingBase<any>, PrometheusComposedMetric[]][]> {
    const sloGroup = 'slo.polaris-slo-cloud.github.io';
    const mappingKind = `${composedMetricType}MetricMapping`;
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
        const objects = await getSloMappingObjects(crd, customObjectsApi, requiredNamespace);
        for (const sloObject of objects) {
            const labels = buildLabels(sloObject, crd);
            const composedMetrics = await listComposedMetricsWithLabels(
                kubeConfig,
                mappingKind,
                metricsGroup,
                metricsVersion,
                labels,
                composedMetricTypePkg,
                composedMetricType,
                host,
            );
            composedMetricsPerSlo.push([sloObject, composedMetrics]);
        }
    }

    return composedMetricsPerSlo;
}

// get all metric mapping crds
async function listComposedMetricsWithLabels(
    kubeConfig: KubeConfig,
    kind: string,
    group: string,
    version: string,
    labels: Record<string, string>,
    composedMetricTypePkg: string,
    composedMetricType: string,
    host: Tree,
): Promise<PrometheusComposedMetric[]> {
    const apiextensionsV1Api = kubeConfig.makeApiClient(ApiextensionsV1Api);
    const customObjectsApi = kubeConfig.makeApiClient(CustomObjectsApi);

    const crdResponse = await apiextensionsV1Api.listCustomResourceDefinition();
    const allCrds = crdResponse.body;
    const crds = [];
    // filter all crds that match our group
    for (const crd of allCrds.items) {
        const crdGroup = crd.spec.group;
        const crdKind = crd.spec.names.kind;
        if (crdGroup === group && kind === crdKind) {
            crds.push(crd);
        }
    }
    const labelSelector = convertLabelsToSelector(labels);
    // get for each slo mapping object the metric mappings
    const metricMappings = [];
    for (const crd of crds) {
        const plural = crd.spec.names.plural;
        const response = await customObjectsApi.listClusterCustomObject(group, version, plural, 'true', false, undefined, '', labelSelector);

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
        /* eslint-disable @typescript-eslint/no-unsafe-argument */
        /* eslint-disable @typescript-eslint/restrict-template-expressions */
        /* eslint-disable @typescript-eslint/no-unsafe-call */
        const metricPropKeys = await readMetricPropKeys(composedMetricTypePkg, composedMetricType, host);
        const obj = {
            sloName: metricMapping.metadata.labels['polaris-slo-cloud.github.io/owner-name'],
            sloKind: metricMapping.metadata.labels['polaris-slo-cloud.github.io/owner-kind'],
            timeSeriesName: `polaris_composed_${snakeCase(metricMapping.apiVersion)}_${snakeCase(metricMapping.kind.replace('MetricMapping', ''))}`,
            targetGvk: `${metricMapping.spec.targetRef.apiVersion}/${metricMapping.spec.targetRef.kind}`,
            targetNamespace: metricMapping.metadata.namespace,
            targetName: metricMapping.spec.targetRef.name,
            metricPropKeys,
        };
        prometheusMetrics.push(obj);
    }
    return prometheusMetrics;
}

function createDummyFile(composedMetricType: string, composedMetricTypePkg: string, host: Tree): string {
    const projectName = 'metrics-dashboard';
    const tempDir = getTempDir(projectName, 'dash');
    const content = `
    import {${composedMetricType}} from '${composedMetricTypePkg}';`;
    const filePath = `${tempDir}/dummy.ts`;
    host.write(filePath, content);
    const changes = host.listChanges();
    flushChanges(host.root, changes);
    return filePath;
}

function deleteDir(host: Tree): void {
    const projectName = 'metrics-dashboard';
    const tempDir = getTempDir(projectName, 'dash');
    host.delete(tempDir);
    const changes = host.listChanges();
    flushChanges(host.root, changes);
}

async function readMetricPropKeys(composedMetricTypePkg: string, composedMetricType: string, host: Tree): Promise<string[]> {
    const typeName = composedMetricType;
    const path = createDummyFile(composedMetricType, composedMetricTypePkg, host);

    const origJsonSchema = createGenerator({
        ...TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG,
        tsconfig: TS_CONFIG_FILE,
        path,
        type: typeName,
        jsDoc: 'extended',
        skipTypeCheck: false,
        topRef: false,
    }).createSchema(typeName);

    const metricPropKeys = [];
    for (const propKey of Object.keys(origJsonSchema.properties)) {
        const prop = origJsonSchema.properties[propKey];
        // eslint-disable-next-line no-prototype-builtins
        if (prop.hasOwnProperty('$ref')) {
            // console.log(`complex property ${propKey}`)
        // eslint-disable-next-line no-prototype-builtins
        } else if (typeof prop === 'object' && prop.hasOwnProperty('type') && prop.type === 'number') {
            // console.log(`add property ${propKey}`)
            metricPropKeys.push(propKey);
        } else {
            // console.log(`Found metric prop key that is not of type number: ${propKey}`)
        }
    }
    for (const defKey of Object.keys(origJsonSchema.definitions)) {
        const definition = origJsonSchema.definitions[defKey];
        if (typeof definition === 'object') {
            const properties = definition.properties;
            if (properties !== undefined) {
                for (const propKey of Object.keys(properties)) {
                    // console.log(`add property ${camelCase(defKey)}.${propKey}`)
                    metricPropKeys.push(`${camelCase(defKey)}.${propKey}`);
                }
            }
        }
    }
    deleteDir(host);
    return Promise.resolve(metricPropKeys);
}

type KubernetesObjectHeader<T extends KubernetesObject | KubernetesObject> = Pick<T, 'apiVersion' | 'kind'> & {
    metadata: {
        name: string;
        namespace: string;
    };
};

export async function apply(kubeConfig: KubeConfig, specString: string): Promise<KubernetesObject[]> {
    const client = KubernetesObjectApi.makeApiClient(kubeConfig);

    const specs: KubernetesObject[] = loadAll(specString).flat();
    const validSpecs = specs.filter((s): s is KubernetesObjectHeader<KubernetesObject> => s && !!s.kind && !!s.metadata);
    const created: KubernetesObject[] = [];
    for (const spec of validSpecs) {
        try {
            await client.read(spec);
            // Note that this could fail if the spec refers to a custom resource. For custom resources you may need
            // to specify a different patch merge strategy in the content-type header.
            //
            // See: https://github.com/kubernetes/kubernetes/issues/97423
            const response = await client.patch(spec);
            created.push(response.body);
        } catch (e) {
            // resource doesn't exist -> create it
            const response = await client.create(spec);
            created.push(response.body);
        }
    }
    return created;
}

export function getClusterRoleFromManifest(manifest: unknown[]): V1ClusterRole | undefined {
    return manifest.find((obj): obj is V1ClusterRole => typeof obj === 'object' && 'kind' in obj && obj.kind === 'ClusterRole');
}

export function getClusterRoleBindingFromManifest(manifest: unknown[]): V1ClusterRoleBinding | undefined {
    return manifest.find((obj): obj is V1ClusterRoleBinding => typeof obj === 'object' && 'kind' in obj && obj.kind === 'ClusterRoleBinding');
}

export async function getDeployedClusterRole(name: string, kubeConfig: KubeConfig): Promise<V1ClusterRole> {
    const rbacAuthorizationApi = kubeConfig.makeApiClient(RbacAuthorizationV1Api);
    try {
        const response = await rbacAuthorizationApi.readClusterRole(name);
        return response.body;
    } catch (error) {
        if (error.statusCode === 404) {
            return undefined;
        }
        throw error;
    }
}

export async function getDeployedClusterRoleBinding(name: string, kubeConfig: KubeConfig): Promise<V1ClusterRoleBinding> {
    const rbacAuthorizationApi = kubeConfig.makeApiClient(RbacAuthorizationV1Api);
    try {
        const response = await rbacAuthorizationApi.readClusterRoleBinding(name);
        return response.body;
    } catch (error) {
        if (error.statusCode === 404) {
            return undefined;
        }
        throw error;
    }
}
