import { PolarisType } from '../transformation';
import { initSelf } from '../util';
import { ApiObjectMetadata } from './api-object-metadata';
import { Container } from './container';

/**
 * Specifies the properties of a pod.
 */
 export class PodSpec {

    /** The containers that should run inside this pod. */
    @PolarisType(() => Container)
    containers: Container[];

    constructor(initData?: Partial<PodSpec>) {
        initSelf(this, initData);
    }

}


/**
 * Describes a template that is used for creating pods.
 */
export class PodTemplate {

    /**
     * Provides metadata about the pod.
     */
    @PolarisType(() => ApiObjectMetadata)
    metadata?: ApiObjectMetadata;

    /**
     * The specification of the pod.
     */
    @PolarisType(() => PodSpec)
    spec?: PodSpec;

    constructor(initData?: Partial<PodTemplate>) {
        initSelf(this, initData);
    }

}
