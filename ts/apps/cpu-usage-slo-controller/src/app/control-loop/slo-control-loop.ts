import { ServiceLevelObjective, getSloConfiguration } from '../sloc-policy-language';
import { IndexByKey } from '../util';
import { KubeConfig, KubernetesObjectApi } from '@kubernetes/client-node';
import { KubernetesObjectWithSpec } from '../model';

export const DEFAULT_INTERVAL = 20000;

export class SloControlLoop {

    private loopTimer: NodeJS.Timeout;

    private registeredSlos: IndexByKey<ServiceLevelObjective<any, any>> = {};

    private k8sClient: KubernetesObjectApi;

    constructor(kc: KubeConfig) {
        this.k8sClient = KubernetesObjectApi.makeApiClient(kc);
    }

    start(intervalMs: number = DEFAULT_INTERVAL): void {
        if (this.loopTimer) {
            return;
        }
        this.loopTimer = setInterval(() => this.runLoopIteration(), intervalMs);
    }

    stop(): void {
        if (!this.loopTimer) {
            return;
        }
        clearInterval(this.loopTimer);
        this.loopTimer = null;
    }

    registerSlo(sloId: string, sloHandler: ServiceLevelObjective<any, any>): void {
        this.registeredSlos[sloId] = sloHandler;
    }

    unregisterSlo(sloId: string): void {
        delete this.registeredSlos[sloId];
    }

    private runLoopIteration(): void {
        Object.keys(this.registeredSlos).forEach(sloId => {
            const slo = this.registeredSlos[sloId];
            this.evaluateSlo(sloId, slo);
        });
    }

    private evaluateSlo(sloId: string, slo: ServiceLevelObjective<any, any>): void {
        console.log(`Evaluating SLO ${sloId}`)

        slo.evaluate().then(resultSpec => {
            if (!resultSpec) {
                console.log(`SLO ${sloId} returned null, i.e., no resource changes necessary`);
                return;
            }

            const sloConfig = getSloConfiguration(slo);
            const elasticityStrategy: KubernetesObjectWithSpec<any> = {
                apiVersion: sloConfig.elasticityStrategyApiVersion,
                kind: sloConfig.elasticityStrategyKind,
                spec: resultSpec,
            };

            console.log(`SLO ${sloId}: Applying elasticityStrategy`, elasticityStrategy);

            this.k8sClient.create(
                elasticityStrategy
            ).catch(err => {
                console.log(`Create resource failed, trying to replace the resource`, err);
                return this.k8sClient.replace(elasticityStrategy);
            }).then(
                () => console.log('Resource successfully created/replaced')
            ).catch(console.error)
        });
    }

}
