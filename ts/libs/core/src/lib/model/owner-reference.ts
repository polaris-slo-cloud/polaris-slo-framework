import { initSelf } from '../util';
import { ObjectReference } from './object-reference';

/**
 * Identifies the owner of an `ApiObject`.
 *
 * When creating a new `ApiObject`, its owner reference should be set in the metadata
 * to ensure that the new object is garbage collected if the owner is deleted.
 *
 * Owner references must be in the same namespace by design, akin to Kubernetes owner references
 * (https://kubernetes.io/docs/concepts/workloads/controllers/garbage-collection/ ).
 */
export class OwnerReference extends ObjectReference {

    /** UID of the owner object. */
    uid: string;

    /**
     * If `true`, the owner is the managing controller.
     *
     * Default: `false`
     */
    controller?: boolean;

    /**
     * If `true` and supported by the finalizer configuration of the owner,
     * the owner cannot be deleted until this object has been deleted.
     *
     * Default: `false`
     */
    blockOwnerDeletion?: boolean;

    constructor(initData?: Partial<OwnerReference>) {
        super(initData);
        initSelf(this, initData);
    }

}
