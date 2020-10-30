import { ObjectKind } from '../../../model';
import { ObjectKindWatcher } from './object-kind-watcher';

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
