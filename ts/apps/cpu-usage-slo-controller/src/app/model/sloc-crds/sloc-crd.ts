import { SLOC_API_VERSION } from './sloc-api';
import { V1ObjectMeta } from '@kubernetes/client-node';

export interface SlocCRD<K extends string, T> {

    apiVersion: typeof SLOC_API_VERSION;

    kind: K;

    metadata?: V1ObjectMeta;

    spec: T;

}
