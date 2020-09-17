import { SLOC_API_VERSION } from './sloc-api';
import { KubernetesObject } from '@kubernetes/client-node';

export interface KubernetesObjectWithSpec<T> extends KubernetesObject {
    spec: T;
}

export interface SlocCRD<K extends string, T> extends KubernetesObjectWithSpec<T> {

    apiVersion: typeof SLOC_API_VERSION;

    kind: K;

}
