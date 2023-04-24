import { KubernetesObject } from '@kubernetes/client-node';

export interface ApiVersionKind {
    apiVersion?: string;
    kind: string;
}

export interface CrossVersionObjectReference extends ApiVersionKind {
    name: string;
}

export interface KubernetesObjectWithSpec<T> extends KubernetesObject {

    spec: T;

}

// Captures the information needed for issuing a read request to Kubernetes.
//
// This type definition is copied from @kubernetes/client-node, because it is not exported from there.
export type KubernetesObjectHeader<T extends KubernetesObject | KubernetesObject> = Pick<T, 'apiVersion' | 'kind'> & {
    metadata: {
        name: string;
        namespace: string;
    };
};
