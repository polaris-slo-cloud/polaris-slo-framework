import { initSelf } from '../util';
import { ObjectReference } from './object-reference';

/**
 * Identifies that target workload for an SLO mapping.
 */
export class SloTarget extends ObjectReference {

    constructor(initData?: Partial<SloTarget>) {
        super(initData);
        initSelf(this, initData);
    }

}
