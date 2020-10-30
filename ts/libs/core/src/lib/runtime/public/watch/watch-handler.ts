import { ApiObject } from '../../../model';

/**
 * Handles events that occur when watching an `ObjectKind` with an `ObjectKindWatcher`.
 *
 * The objects passed to the `WatchHandler` must have already been transformed into SLOC objects.
 *
 * @param T The type of `ApiObject` that is handled by this `WatchHandler`.
 */
export interface WatchHandler<T extends ApiObject<any> = ApiObject<any>> {

    /**
     * Called when the watch detects that a new `ApiObject` has been added to the orchestrator.
     *
     * @param obj The new `ApiObject`.
     */
    onObjectAdded(obj: T): void;

    /**
     * Called when the watch detects that an existing `ApiObject` in the orchestrator has been modified.
     *
     * @param obj The modified `ApiObject`.
     */
    onObjectModified(obj: T): void;

    /**
     * Called when the watch detects that an existing `ApiObject` in the orchestrator has been deleted.
     *
     * @param obj The `ApiObject` that has been deleted.
     */
    onObjectDeleted(obj: T): void;

}
