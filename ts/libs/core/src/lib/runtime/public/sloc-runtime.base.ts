import { DefaultElasticityStrategyService, ElasticityStrategyService } from '../../elasticity';
import { DefaultSloControlLoop, SloControlLoop, SloEvaluator } from '../../slo';
import { DefaultSlocTransformationService, SlocTransformationService } from '../../transformation/public/service';
import { SlocRuntime } from './sloc-runtime';
import { ObjectKindWatcher } from './watch';

export abstract class SlocRuntimeBase implements SlocRuntime {

    transformer: SlocTransformationService = new DefaultSlocTransformationService();

    elasticityStrategyService: ElasticityStrategyService;

    constructor() {
        this.elasticityStrategyService = new DefaultElasticityStrategyService(this.transformer);
    }

    abstract createSloEvaluator(): SloEvaluator;

    createSloControlLoop(): SloControlLoop {
        return new DefaultSloControlLoop();
    }

    abstract createObjectKindWatcher(): ObjectKindWatcher;

}
