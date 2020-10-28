import { DefaultElasticityStrategyService, ElasticityStrategyService } from '../../elasticity';
import { DefaultSlocTransformationService, SlocTransformationService } from '../../transformation/public/service';
import { SlocRuntime } from './sloc-runtime';

export abstract class SlocRuntimeBase implements SlocRuntime {

    transformer: SlocTransformationService = new DefaultSlocTransformationService();

    elasticityStrategyService: ElasticityStrategyService;

    constructor() {
        this.elasticityStrategyService = new DefaultElasticityStrategyService(this.transformer);
    }

}
