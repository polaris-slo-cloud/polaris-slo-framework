import { SlocType } from '../transformation';
import { initSelf } from '../util';
import { ObjectReference } from './object-reference';

export class SloTarget {

    @SlocType(() => ObjectReference)
    targetRef: ObjectReference;

    constructor(initData?: Partial<SloTarget>) {
        initSelf(this, initData);
    }

}
