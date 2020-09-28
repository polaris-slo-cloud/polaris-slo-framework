import { initSelf } from '../util';

export class ObjectReference {

    apiVersion?: string;

    kind: string;

    name: string;

    constructor(initData?: Partial<ObjectReference>) {
        initSelf(this, initData);
    }

}
