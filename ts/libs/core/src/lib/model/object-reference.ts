import { initSelf } from '../util';
import { ObjectKind } from './object-kind';

/**
 * Identifies a particular object instance in the orchestrator.
 *
 * @note This type does not include a `namespace` property, which means that only
 * objects within the same namespace as the wrapping `ApiObject` can be referenced.
 * This should be enough for most cases, but if it proves too limiting, we can extend this
 * type or create a new subclass with a `namespace` property.
 */
export class ObjectReference extends ObjectKind {

    /** The name of the instance. */
    name: string;

    constructor(initData?: Partial<ObjectReference>) {
        super(initData);
        initSelf(this, initData);
    }

}
