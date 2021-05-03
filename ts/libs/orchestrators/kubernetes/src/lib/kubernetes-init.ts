import { KubeConfig } from '@kubernetes/client-node';
import { ApiObject, ObjectKind, ObjectReference, SlocRuntime, initSlocRuntime } from '@polaris-sloc/core';
import { KubernetesSlocRuntime } from './runtime';
import { ObjectKindTransformer, ObjectReferenceTransformer } from './transformation';
import { ApiObjectTransformer } from './transformation/public/transformers/api-object.transformer';

/**
 * Initializes the Kubernetes SLOC runtime and sets it as the global singleton.
 *
 * @param kubeConfig The Kubernetes configuration that should be used to configure the `KubernetesSlocRuntime`.
 */
export function initSlocKubernetes(kubeConfig: KubeConfig): SlocRuntime {
    console.log('Initializing Kubernetes connector with KUBECONFIG:', kubeConfig);
    const runtime = new KubernetesSlocRuntime(kubeConfig);
    registerTransformers(runtime);
    initSlocRuntime(runtime);
    return runtime;
}

function registerTransformers(runtime: SlocRuntime): void {
    runtime.transformer.registerTransformer(ObjectKind, new ObjectKindTransformer(), { inheritable: true });
    // Registering ObjectReferenceTransformer as inheritable for the ObjectReference class makes it available for SloTarget as well.
    runtime.transformer.registerTransformer(ObjectReference, new ObjectReferenceTransformer(), { inheritable: true });
    runtime.transformer.registerTransformer(ApiObject, new ApiObjectTransformer<any>(), { inheritable: true });
}
