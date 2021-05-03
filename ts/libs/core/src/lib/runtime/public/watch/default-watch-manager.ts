import { ApiObject, ObjectKind } from '../../../model';
import { PolarisRuntime } from '../polaris-runtime';
import { ObjectKindsAlreadyWatchedError } from './errors';
import { ObjectKindWatcher } from './object-kind-watcher';
import { WatchEventsHandler } from './watch-events-handler';
import { WatchManager } from './watch-manager';

export class DefaultWatchManager implements WatchManager {

    private watchers: Map<string, ObjectKindWatcher> = new Map();

    constructor(private slocRuntime: PolarisRuntime) { }

    get activeWatchers(): ObjectKindWatcher[] {
        return Array.from(this.watchers.values());
    }

    async startWatchers(kinds: ObjectKind[], handler: WatchEventsHandler<ApiObject<any>>): Promise<ObjectKindWatcher[]> {
        this.assertNoExistingWatchers(kinds);

        const watchers = kinds.map(async kind => {
            const watcher = this.slocRuntime.createObjectKindWatcher();
            await watcher.startWatch(kind, handler);
            this.watchers.set(kind.toString(), watcher);
            return watcher;
        });

        return Promise.all(watchers);
    }

    stopWatchers(kinds: ObjectKind[]): void {
        kinds.forEach(kind => {
            const key = kind.toString();
            const watcher = this.watchers.get(key);
            if (watcher) {
                watcher.stopWatch();
                this.watchers.delete(key)
            }
        });
    }

    private assertNoExistingWatchers(kinds: ObjectKind[]): void {
        const watchedKinds = kinds.filter(kind => this.watchers.has(kind.toString()));
        if (watchedKinds.length > 0) {
            throw new ObjectKindsAlreadyWatchedError(this, watchedKinds);
        }
    }

}
