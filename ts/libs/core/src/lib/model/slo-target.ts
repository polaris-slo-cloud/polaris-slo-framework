import { initSelf } from '../util';
import { ObjectReference } from './object-reference';

/**
 * Identifies that target workload for an SLO mapping.
 *
 * @note This type does not include a `namespace` property, which means that only
 * objects within the same namespace as the wrapping `SloMapping` object can be referenced.
 * This should be enough for most cases, but if it proves too limiting, we can extend this
 * type or create a new subclass with a `namespace` property.
 */
export class SloTarget extends ObjectReference {

    constructor(initData?: Partial<SloTarget>) {
        super(initData);
        initSelf(this, initData);
    }

}
