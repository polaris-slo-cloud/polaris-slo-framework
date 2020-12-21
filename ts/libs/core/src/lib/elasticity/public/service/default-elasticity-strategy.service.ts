import { ApiObjectMetadata, ElasticityStrategy, ElasticityStrategyKind, ElasticityStrategySpec } from '../../../model';
import { SloOutput } from '../../../slo';
import { SlocTransformationService } from '../../../transformation';
import { SlocConstructor } from '../../../util';
import { ElasticityStrategyService } from './elasticity-strategy-service';

export class DefaultElasticityStrategyService implements ElasticityStrategyService {

    constructor(private transformationService: SlocTransformationService) {
    }

    fromSloOutput<T>(name: string, sloOutput: SloOutput<T>): ElasticityStrategy<T> {
        const elasticityStrategyCtor: SlocConstructor<ElasticityStrategy<T>> =
            this.transformationService.getSlocType(sloOutput.sloMapping.spec.elasticityStrategy) ?? ElasticityStrategy;
        const specCtor: SlocConstructor<ElasticityStrategySpec<T>> =
            this.transformationService.getPropertyType(elasticityStrategyCtor, 'spec') ?? ElasticityStrategySpec;

        return new elasticityStrategyCtor({
            objectKind: new ElasticityStrategyKind(sloOutput.sloMapping.spec.elasticityStrategy),
            metadata: new ApiObjectMetadata({
                name,
                namespace: sloOutput.sloMapping.metadata.namespace,
            }),
            spec: new specCtor({
                targetRef: sloOutput.sloMapping.spec.targetRef,
                sloOutputParams: sloOutput.elasticityStrategyParams,
                staticConfig: sloOutput.sloMapping.spec.staticElasticityStrategyConfig,
            }),
        });
    }

}
