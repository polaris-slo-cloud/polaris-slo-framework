import { SloTarget } from '@sloc/core';

export class RestServiceTarget extends SloTarget {

    kind: 'Deployment' | 'ReplicaSet';

    constructor(initData?: Partial<RestServiceTarget>) {
        super(initData);
    }

}
