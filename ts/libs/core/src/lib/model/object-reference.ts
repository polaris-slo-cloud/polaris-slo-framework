import { initSelf } from '../util';
import { ObjectKind } from './object-kind';

/**
 * Identifies a particular object instance in the orchestrator.
 *
 * @note This type does not include a `namespace` property, which means that only
 * objects within the same namespace as the wrapping `ApiObject` can be referenced.
 * This should be enough for most cases, because, e.g., in Kubernetes, many resources
 * are designed to only reference other resources in the same namespace.
 */
export class ObjectReference extends ObjectKind {

    /** The name of the instance. */
    name: string;

    constructor(initData?: Partial<ObjectReference>) {
        super(initData);
        initSelf(this, initData);
    }

}

/**
 * Identifies a particular object instance, together with its namespace, in the orchestrator.
 */
export class NamespacedObjectReference extends ObjectReference {

    /** The namespace, where the instance is located. */
    namespace: string;

    constructor(initData?: Partial<NamespacedObjectReference>) {
        super(initData);
        initSelf(this, initData);
    }

}
