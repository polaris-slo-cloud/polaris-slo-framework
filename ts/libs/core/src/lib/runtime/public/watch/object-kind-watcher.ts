import { ObjectKind } from '../../../model';
import { WatchHandler } from './watch-handler';

/**
 * Watches an `ObjectKind` on the orchestrator and passes them to the `WatchHandler`.
 *
 * The objects passed to the `WatchHandler` have already been transformed into SLOC objects.
 */
export interface ObjectKindWatcher {

    /**
     * `true` if this watcher is currently watching an `ObjectKind`.
     */
    readonly isActive: boolean;

    /**
     * The `ObjectKind` that is currently being watched.
     */
    readonly kind: ObjectKind;

    /**
     * The handler that receives events from this watcher.
     */
    readonly handler: WatchHandler;

    /**
     * Starts a watch on the specified `ObjectKind`.
     *
     * @param kinds The `ObjectKind` instance that describe the type of objects that should be watched.
     * @param handler The `WatchHandler` that will receive events from this watcher.
     * @returns A Promise that resolves when the watch has been successfully started or rejects, if there is an error.
     */
    startWatch(kind: ObjectKind, handler: WatchHandler): Promise<void>;

    /**
     * Stops the watch.
     */
    stopWatch(): void;

}
