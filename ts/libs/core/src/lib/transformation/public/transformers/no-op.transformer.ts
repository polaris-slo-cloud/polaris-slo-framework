import { InterfaceOf } from '../../../util';
import { SlocTransformer } from '../sloc-transformer';

/**
 * A `SlocTransformer` that does not modify the objects.
 *
 * The no-op transformer should be used if the SLOC type's structure is equivalent to
 * the orchestrator-specific plain object's structure.
 */
export class NoOpTransformer<T> implements SlocTransformer<T, InterfaceOf<T>> {

    transformToSlocObject(orchPlainObj: InterfaceOf<T>): InterfaceOf<T> {
        return orchPlainObj;
    }

    transformToOrchestratorPlainObject(slocObj: T): InterfaceOf<T> {
        return slocObj;
    }

}

