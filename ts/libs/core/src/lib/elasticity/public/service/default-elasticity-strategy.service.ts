import { ApiObjectMetadata, ElasticityStrategy, ElasticityStrategyKind, ElasticityStrategySpec } from '../../../model';
import { SloOutput } from '../../../slo';
import { PolarisTransformationService } from '../../../transformation';
import { PolarisConstructor } from '../../../util';
import { ElasticityStrategyService } from './elasticity-strategy-service';

export class DefaultElasticityStrategyService implements ElasticityStrategyService {

    constructor(private transformationService: PolarisTransformationService) {
    }

    fromSloOutput<T>(name: string, sloOutput: SloOutput<T>): ElasticityStrategy<T> {
        const elasticityStrategyCtor: PolarisConstructor<ElasticityStrategy<T>> =
            this.transformationService.getPolarisType(sloOutput.sloMapping.spec.elasticityStrategy) ?? ElasticityStrategy;
        const specCtor: PolarisConstructor<ElasticityStrategySpec<T>> =
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
