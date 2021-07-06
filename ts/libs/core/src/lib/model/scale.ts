import { PolarisType } from '../transformation';
import { initSelf } from '../util';
import { ApiObject } from './api-object';
import { ObjectKind } from './object-kind';

/**
 * Spec of a `Scale` API object.
 */
export class ScaleSpec {

    /**
     * The number of instances that should exist of the controlled object.
     *
     * @example `replicas = 4` for a workload means that there should be 4 active instances of this workload.
     */
    replicas: number;

    constructor(initData?: Partial<ScaleSpec>) {
        initSelf(this, initData);
    }

}

/**
 * Used to configure the current horizontal scaling state (i.e., number of instances) of a workload.
 *
 * The scale always applies to a particular target object. How this relationship is implemented,
 * e.g., if there is a scale subresource as in Kubernetes or if scale is a standalone API object,
 * depends on the orchestrator.
 */
export class Scale extends ApiObject<ScaleSpec> {

    @PolarisType(() => ScaleSpec)
    spec: ScaleSpec;

    constructor(initData?: Partial<Scale>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'autoscaling',
            version: 'v1',
            kind: 'Scale',
        });
    }

}
