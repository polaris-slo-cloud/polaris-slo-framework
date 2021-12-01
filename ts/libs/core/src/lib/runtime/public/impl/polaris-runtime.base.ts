import { ComposedMetricsManager } from '../../../composed-metrics';
import { DefaultComposedMetricsManager } from '../../../composed-metrics/public/control/impl';
import { ElasticityStrategyManager, ElasticityStrategyService } from '../../../elasticity';
import { DefaultElasticityStrategyManager } from '../../../elasticity/public/control/impl/default-elasticity-strategy-manager';
import { DefaultElasticityStrategyService } from '../../../elasticity/public/service/impl/default-elasticity-strategy.service';
import { MetricsSourcesManager } from '../../../metrics';
import { DefaultMetricsSourcesManager } from '../../../metrics/public/impl';
import { ObjectKindWatcher, OrchestratorClient, WatchManager } from '../../../orchestrator';
import { DefaultMicrocontrollerFactory, DefaultWatchManager } from '../../../orchestrator/public/impl';
import { SloControlLoop, SloEvaluator } from '../../../slo';
import { DefaultSloControlLoop } from '../../../slo/public/control/impl';
import { PropertyTransformer } from '../../../transformation/internal/property-transformer';
import { PolarisTransformationServiceManager } from '../../../transformation/public/common';
import { DefaultPolarisTransformationService } from '../../../transformation/public/impl';
import { PolarisRuntime } from '../polaris-runtime';

/**
 * `PolarisRuntimeBase` can be used as a superclass for orchestrator-specific {@link PolarisRuntime} implementations.
 */
export abstract class PolarisRuntimeBase implements PolarisRuntime {

    transformer: PolarisTransformationServiceManager = new DefaultPolarisTransformationService();

    elasticityStrategyService: ElasticityStrategyService;

    metricsSourcesManager: MetricsSourcesManager = new DefaultMetricsSourcesManager(this);

    constructor() {
        this.elasticityStrategyService = new DefaultElasticityStrategyService(this.transformer);
        PropertyTransformer.initPropertyTransformer(() => this.transformer);
    }

    abstract createSloEvaluator(): SloEvaluator;

    abstract createObjectKindWatcher(): ObjectKindWatcher;

    abstract createOrchestratorClient(): OrchestratorClient;

    createSloControlLoop(): SloControlLoop {
        return new DefaultSloControlLoop(new DefaultMicrocontrollerFactory());
    }

    createElasticityStrategyManager(): ElasticityStrategyManager {
        return new DefaultElasticityStrategyManager(this);
    }

    createWatchManager(): WatchManager {
        return new DefaultWatchManager(this);
    }

    createComposedMetricsManager(): ComposedMetricsManager {
        return new DefaultComposedMetricsManager(this);
    }

}
