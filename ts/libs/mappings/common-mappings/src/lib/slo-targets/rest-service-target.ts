import { SloTarget } from '@sloc/core';
import { ReplicableTarget } from './replicable-target';

export class RestServiceTarget extends ReplicableTarget {

    constructor(initData?: Partial<RestServiceTarget>) {
        super(initData);
    }

}
