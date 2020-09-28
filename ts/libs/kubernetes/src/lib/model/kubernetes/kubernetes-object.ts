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
