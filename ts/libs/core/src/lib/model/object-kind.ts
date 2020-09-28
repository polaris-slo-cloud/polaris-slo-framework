import { initSelf } from '../util';

/**
 * Unambiguously identifies the type of an object within the orchestrator.
 */
export class ObjectKind {

    /** The group/package that the kind is part of. */
    group?: string;

    /** The version of the group/package. */
    version?: string;

    /** The object type within the group/package. */
    kind: string;

    constructor(initData?: Partial<ObjectKind>) {
        initSelf(this, initData);
    }

}
