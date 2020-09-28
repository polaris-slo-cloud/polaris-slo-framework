import { SlocType } from '../transformation';
import { initSelf } from '../util';
import { ObjectReference } from './object-reference';

/**
 * Identifies that target workload for an SLO mapping.
 */
export class SloTarget {

    /**
     * The target workload that this object should be applied to.
     */
    @SlocType(() => ObjectReference)
    targetRef: ObjectReference;

    constructor(initData?: Partial<SloTarget>) {
        initSelf(this, initData);
    }

}
