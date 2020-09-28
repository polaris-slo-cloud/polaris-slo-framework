import { ObjectKind, ObjectReference, SlocRuntime, initSlocRuntime } from '@sloc/core';
import { KubernetesSlocRuntime } from './runtime';
import { ObjectKindTransformer, ObjectReferenceTransformer } from './transformation';

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
    runtime.transformer.registerTransformer(ObjectKind, new ObjectKindTransformer());
    runtime.transformer.registerTransformer(ObjectReference, new ObjectReferenceTransformer());
}
