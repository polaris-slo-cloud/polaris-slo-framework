import { ObjectKind } from '../../../model';
import { ObjectKindWatcher } from './object-kind-watcher';
import { WatchEventsHandler } from './watch-events-handler';

/**
 * Allows combining and managing multiple `ObjectKindWatchers`.
 */
export interface WatchManager {

    /**
     * The watchers that are currently active.
     */
    readonly activeWatchers: ObjectKindWatcher[];

    /**
     * Creates and starts an `ObjectKindWatcher` for each of the specified `ObjectKinds` and connects
     * them to the specified `WatchEventsHandler`.
     *
     * If a watch has already been started for one or more items in `kinds`, the Promise rejects with an error.
     *
     * @param kinds The `ObjectKinds` that should be watched.
     * @param handler The `WatchEventHandler` that the watchers should be connected.
     * @returns A Promise that resolves when all watchers have been created and started or rejects in case of errors.
     */
    startWatchers(kinds: ObjectKind[], handler: WatchEventsHandler): Promise<ObjectKindWatcher[]>;

    /**
     * Stops the watchers for the specified `ObjectKinds`.
     *
     * `ObjectKinds`, for which no watcher has been started, are ignored.
     *
     * @param kinds The `ObjectKinds`, whose watchers should be stopped.
     */
    stopWatchers(kinds: ObjectKind[]): void;

}
