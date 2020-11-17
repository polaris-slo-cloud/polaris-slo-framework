import { ObjectKind } from '../../../model';
import { ObjectKindWatcher } from './object-kind-watcher';
import { WatchManager } from './watch-manager';

/**
 * Error that is thrown by the `ObjectKindWatcher` implementations.
 */
export class ObjectKindWatcherError extends Error {

    constructor(public watcher: ObjectKindWatcher, message?: string) {
        super(message);
    }

}

/**
 * Error that is thrown if required parts of `ObjectKind` when starting a watch.
 */
export class ObjectKindPropertiesMissingError extends ObjectKindWatcherError {

    constructor(
        public watcher: ObjectKindWatcher,
        public kind: ObjectKind,
        missingProperties: (keyof ObjectKind)[],
    ){
        super(watcher, `The following required properties are missing from the specified ObjectKind: ${missingProperties.join()}`);
    }

}

/**
 * Error that is thrown if `ObjectKindWatcher.startWatch()` is called while the watch is already active.
 */
export class WatchAlreadyStartedError extends ObjectKindWatcherError {

    constructor(public watcher: ObjectKindWatcher) {
        super(watcher, 'Cannot start a watch, because this watcher has already been started.');
    }

}

/**
 * Error that is thrown if `WatchManager.startWatchers()` is called with one or more `ObjectKinds`, for which a watch has already been started.
 */
export class ObjectKindsAlreadyWatchedError extends Error {

    constructor(public watchManager: WatchManager, public watchedKinds: ObjectKind[]) {
        super(`The following ObjectKinds are already being watched by this WatchManager: ${watchedKinds.map(kind => kind.toString()).join(',\n')}`)
    }

}
