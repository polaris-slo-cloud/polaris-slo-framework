import { DefaultTransformer, ObjectReference, SlocRuntime, initSlocRuntime } from '@sloc/core';
import { KubernetesSlocRuntime } from './runtime';

/**
 * Initializes the Kubernetes SLOC runtime and sets it as the global singleton.
 */
export function initSlocKubernetes(): SlocRuntime {
    const runtime = new KubernetesSlocRuntime();
    registerTransformers(runtime);
    initSlocRuntime(runtime);
    return runtime;
}

function registerTransformers(runtime: SlocRuntime): void {
    // Registering the DefaultTransformer is actually not necessary.
    runtime.transformer.registerTransformer(ObjectReference, new DefaultTransformer());
}
