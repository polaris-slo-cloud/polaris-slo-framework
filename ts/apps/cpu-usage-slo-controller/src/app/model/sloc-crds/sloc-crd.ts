import { SLOC_API_VERSION } from './sloc-api';
import { KubernetesObject } from '@kubernetes/client-node';

export interface SlocCRD<K extends string, T> extends KubernetesObject {

    apiVersion: typeof SLOC_API_VERSION;

    kind: K;

    spec: T;

}
