import { ObjectKind, SloTarget } from '../../../../model';
import { ObjectKindWatchHandlerPair, WatchManager } from '../../../../orchestrator';
import { PolarisRuntime } from '../../../../runtime';
import { IndexByKey, executeSafely } from '../../../../util';
import {
    ELASTICITY_STRATEGY_DEFAULT_TIMEOUT_MS,
    ElasticityStrategyKindControllerPair,
    ElasticityStrategyManager,
    ElasticityStrategyManagerConfig,
} from '../elasticity-strategy-manager';
import { DefaultElasticityStrategyWatchEventsHandler } from './default-elasticity-strategy-watch-events-handler';

/**
 * The default `ElasticityStrategyManager` implementation that is usable for all orchestrators.
 */
export class DefaultElasticityStrategyManager implements ElasticityStrategyManager {

    /** The current config of this manager - only set if the manager is active. */
    private config: ElasticityStrategyManagerConfig;

    /** Used to watch the `ElasticityStrategyKinds`. */
    private watchManager: WatchManager;

    /** Contains all `ElasticityStrategyKinds and their controllers.` */
    private watchedKinds: Map<string, DefaultElasticityStrategyWatchEventsHandler> = new Map();

    get isActive(): boolean {
        return !!this.config;
    }

    constructor(protected runtime: PolarisRuntime) {
        this.watchManager = runtime.createWatchManager();
    }

    async startWatching(config: ElasticityStrategyManagerConfig): Promise<void> {
        const timeoutMs = config.timeoutMs ?? ELASTICITY_STRATEGY_DEFAULT_TIMEOUT_MS;
        const kindWatcherPairs: ObjectKindWatchHandlerPair[] = config.kindsToWatch.map(kindAndController => ({
            kind: kindAndController.kind,
            handler: new DefaultElasticityStrategyWatchEventsHandler(kindAndController.kind, kindAndController.controller, timeoutMs),
        }));

        await this.watchManager.startWatchers(kindWatcherPairs);
        this.config = config;
    }

    stopWatching(): void {
        const kinds: ObjectKind[] = [];
        this.watchedKinds.forEach(pair => kinds.push(pair.kind));

        this.watchManager.stopWatchers(kinds);

        this.watchedKinds.forEach(pair => {
            if (pair.controller.onDestroy) {
                executeSafely(() => pair.controller.onDestroy());
            }
        });
        this.watchedKinds.clear();
    }

    getWatchedElasticityStrategyKinds(): ElasticityStrategyKindControllerPair<any, SloTarget, IndexByKey<any>>[] {
        const ret: ElasticityStrategyKindControllerPair[] = [];
        this.watchedKinds.forEach(pair => {
            ret.push({
                kind: pair.kind,
                controller: pair.controller,
            });
        });
        return ret;
    }

}
