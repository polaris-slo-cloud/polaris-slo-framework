import { DefaultTransformer } from '@polaris-sloc/core';


/**
 * Default transformer for the Kubernetes orchestrator.
 *
 * This extends the Polaris {@link DefaultTransformer} and allows augmenting its methods for Kubernetes.
 */
export class KubernetesDefaultTransformer<T> extends DefaultTransformer<T> {
}
