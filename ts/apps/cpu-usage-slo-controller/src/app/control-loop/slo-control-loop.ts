import { ServiceLevelObjective, getSloConfiguration } from '../sloc-policy-language';
import { IndexByKey } from '../util';
import { KubeConfig, KubernetesObjectApi, V1ObjectMeta, KubernetesObject } from '@kubernetes/client-node';
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

    registerSlo(sloHandler: ServiceLevelObjective<KubernetesObject, any>): void {
        const fullSloName = this.getFullSloName(sloHandler.config);
        this.registeredSlos[fullSloName] = sloHandler;
    }

    unregisterSlo(sloMapping: KubernetesObject): void {
        const fullSloName = this.getFullSloName(sloMapping);
        delete this.registeredSlos[fullSloName];
    }

    private runLoopIteration(): void {
        Object.keys(this.registeredSlos).forEach(sloId => {
            const slo = this.registeredSlos[sloId];
            this.evaluateSlo(slo);
        });
    }

    private evaluateSlo(slo: ServiceLevelObjective<KubernetesObject, any>): void {
        const fullSloName = this.getFullSloName(slo.config);
        console.log(`Evaluating SLO ${fullSloName}`)

        slo.evaluate().then(resultSpec => {
            if (!resultSpec) {
                console.log(`SLO ${fullSloName} returned null, i.e., no resource changes necessary`);
                return;
            }

            const sloConfig = getSloConfiguration(slo);
            const metadata = new V1ObjectMeta();
            metadata.namespace = slo.config.metadata.namespace;
            metadata.name = `${fullSloName}-elasticity-strategy`;
            const elasticityStrategy: KubernetesObjectWithSpec<any> = {
                apiVersion: sloConfig.elasticityStrategyApiVersion,
                kind: sloConfig.elasticityStrategyKind,
                metadata: metadata,
                spec: resultSpec,
            };

            console.log(`SLO ${slo.config.metadata.name}: Applying elasticityStrategy`, elasticityStrategy);

            this.k8sClient.create(
                elasticityStrategy
            ).catch(err => {
                console.log(`Create resource failed, trying to replace the resource`);
                this.updateExistingElasticityStrategy(elasticityStrategy);
            }).then(
                () => console.log('Resource successfully created/replaced')
            ).catch(console.error)
        });
    }

    private getFullSloName(sloMapping: KubernetesObject): string {
        return `${sloMapping.metadata.namespace}.${sloMapping.metadata.name}`;
    }

    private async updateExistingElasticityStrategy(newSpec: KubernetesObject): Promise<void> {
        const readReq: KubernetesObject = {
            apiVersion: newSpec.apiVersion,
            kind: newSpec.kind,
            metadata: { ...newSpec.metadata },
        };
        const readResponse = await this.k8sClient.read(readReq);
        const currStrategyData = readResponse.body;

        const newStrategyData = { ...newSpec };
        delete newStrategyData.metadata;
        const update = {
            ...currStrategyData,
            ...newStrategyData,
        };

        await this.k8sClient.replace(update);
    }

}
