import { PolarisType } from '../transformation';
import { initSelf } from '../util';
import { ApiObject } from './api-object';
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

/**
 * Base spec for any ApiObject that contains a `PodTemplate`.
 */
export class PodTemplateContainerSpec {

    /**
     * The template that describes the pod(s) to be created.
     */
    @PolarisType(() => PodTemplate)
    template: PodTemplate;

    constructor(initData?: Partial<PodTemplateContainerSpec>) {
        initSelf(this, initData);
    }

}

/**
 * Generic `ApiObject` that can be used to fetch and edit all objects that contain
 * a `template` property of type `PodTemplate`.
 */
export class PodTemplateContainer extends ApiObject<PodTemplateContainerSpec> {

    @PolarisType(() => PodTemplateContainerSpec)
    spec?: PodTemplateContainerSpec;

    constructor(initData?: Partial<PodTemplateContainer>) {
        super(initData);
        initSelf(this, initData);
    }

}
