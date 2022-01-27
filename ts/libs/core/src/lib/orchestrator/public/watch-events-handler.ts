import { ApiObject } from '../../model';
import { ObjectKindWatcherError } from './error';

/**
 * Handles events that occur when watching an `ObjectKind` with an `ObjectKindWatcher`.
 *
 * The objects passed to the `WatchEventsHandler` must have already been transformed into Polaris objects.
 *
 * @param T The type of `ApiObject` that is handled by this `WatchEventsHandler`.
 */
export interface WatchEventsHandler<T extends ApiObject<any> = ApiObject<any>> {

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

    /**
     * Called when there is an error during the operation of the watch, i.e., after the promise returned by
     * `startWatch()` has already been fulfilled.
     *
     * When this method is called, the watch must be considered broken and should be stopped.
     *
     * @param error The error that caused this situation.
     */
    onError(error: ObjectKindWatcherError): void;

}
