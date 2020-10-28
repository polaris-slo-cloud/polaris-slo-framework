import { initSelf } from '../util';
import { ObjectKind } from './object-kind';

/**
 * Identifies a particular object instance in the orchestrator.
 */
export class ObjectReference extends ObjectKind {

    /** The name of the instance. */
    name: string;

    constructor(initData?: Partial<ObjectReference>) {
        super(initData);
        initSelf(this, initData);
    }

}
