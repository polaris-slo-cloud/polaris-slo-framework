import { NoOpTransformer, SlocRuntime, initSlocRuntime } from '@sloc/core';
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
    runtime.transformer.registerTransformer('test', new NoOpTransformer());
}
