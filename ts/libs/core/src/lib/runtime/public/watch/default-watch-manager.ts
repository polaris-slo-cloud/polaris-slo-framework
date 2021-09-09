import { ApiObject, ObjectKind } from '../../../model';
import { PolarisRuntime } from '../polaris-runtime';
import { ObjectKindsAlreadyWatchedError } from './errors';
import { ObjectKindWatcher } from './object-kind-watcher';
import { WatchEventsHandler } from './watch-events-handler';
import { ObjectKindWatchHandlerPair, WatchManager } from './watch-manager';

export class DefaultWatchManager implements WatchManager {

    private watchers: Map<string, ObjectKindWatcher> = new Map();

    constructor(private polarisRuntime: PolarisRuntime) { }

    get activeWatchers(): ObjectKindWatcher[] {
        return Array.from(this.watchers.values());
    }

    startWatchers(kinds: ObjectKind[], handler: WatchEventsHandler<ApiObject<any>>): Promise<ObjectKindWatcher[]>;
    startWatchers(kindHandlerPairs: ObjectKindWatchHandlerPair[]): Promise<ObjectKindWatcher[]>;
    startWatchers(kindOrPairs: ObjectKind[] | ObjectKindWatchHandlerPair[], handler?: WatchEventsHandler<ApiObject<any>>): Promise<ObjectKindWatcher[]> {
        let kindHandlerPairs: ObjectKindWatchHandlerPair[];
        if (handler) {
            kindHandlerPairs = (kindOrPairs as ObjectKind[]).map(kind => ({ kind, handler }))
        } else {
            kindHandlerPairs = kindOrPairs as ObjectKindWatchHandlerPair[];
        }
        return this.startWatchersInternal(kindHandlerPairs);
    }

    stopWatchers(kinds: ObjectKind[]): void {
        kinds.forEach(kind => {
            const key = ObjectKind.stringify(kind);
            const watcher = this.watchers.get(key);
            if (watcher) {
                watcher.stopWatch();
                this.watchers.delete(key)
            }
        });
    }

    private async startWatchersInternal(kindHandlerPairs: ObjectKindWatchHandlerPair[]): Promise<ObjectKindWatcher[]> {
        this.assertNoExistingWatchers(kindHandlerPairs);

        const watchers = kindHandlerPairs.map(async pair => {
            const watcher = this.polarisRuntime.createObjectKindWatcher();
            await watcher.startWatch(pair.kind, pair.handler);
            this.watchers.set(ObjectKind.stringify(pair.kind), watcher);
            return watcher;
        });

        return Promise.all(watchers);
    }

    private assertNoExistingWatchers(kindsAndHandlers: ObjectKindWatchHandlerPair[]): void {
        const watchedKinds = kindsAndHandlers.filter(pair => this.watchers.has(ObjectKind.stringify(pair.kind)));
        if (watchedKinds.length > 0) {
            const kinds = watchedKinds.map(pair => pair.kind);
            throw new ObjectKindsAlreadyWatchedError(this, kinds);
        }
    }

}
