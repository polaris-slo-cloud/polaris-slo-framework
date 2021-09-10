import { CoreV1Api, KubeConfig } from '@kubernetes/client-node';

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
