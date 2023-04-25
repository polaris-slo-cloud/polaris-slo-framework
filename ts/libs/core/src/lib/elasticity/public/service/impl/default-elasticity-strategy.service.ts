import { ApiObjectMetadata, ElasticityStrategy, ElasticityStrategyKind, ElasticityStrategySpec, OwnerReference } from '../../../../model';
import { SloOutput } from '../../../../slo';
import { PolarisTransformationService } from '../../../../transformation';
import { PolarisConstructor } from '../../../../util';
import { ElasticityStrategyService } from '../elasticity-strategy-service';

export class DefaultElasticityStrategyService implements ElasticityStrategyService {

    constructor(private transformationService: PolarisTransformationService) {
    }

    fromSloOutput<T>(name: string, sloOutput: SloOutput<T>): ElasticityStrategy<T> {
        const elasticityStrategyKind = sloOutput.elasticityStrategy ?? sloOutput.sloMapping.spec.elasticityStrategy;
        const elasticityStrategyCtor: PolarisConstructor<ElasticityStrategy<T>> =
            this.transformationService.getPolarisType(elasticityStrategyKind) ?? ElasticityStrategy;
        const specCtor: PolarisConstructor<ElasticityStrategySpec<T>> =
            this.transformationService.getPropertyType(elasticityStrategyCtor, 'spec') ?? ElasticityStrategySpec;
        const staticElasticityStrategyConfig = sloOutput.staticElasticityStrategyConfig ?? sloOutput.sloMapping.spec.staticElasticityStrategyConfig;

        return new elasticityStrategyCtor({
            objectKind: new ElasticityStrategyKind(elasticityStrategyKind),
            metadata: new ApiObjectMetadata({
                name,
                namespace: sloOutput.sloMapping.metadata.namespace,
                ownerReferences: [
                    new OwnerReference({
                        ...sloOutput.sloMapping.objectKind,
                        name: sloOutput.sloMapping.metadata.name,
                        uid: sloOutput.sloMapping.metadata.uid,
                        blockOwnerDeletion: true,
                    }),
                ],
            }),
            spec: new specCtor({
                targetRef: sloOutput.sloMapping.spec.targetRef,
                sloOutputParams: sloOutput.elasticityStrategyParams,
                stabilizationWindow: sloOutput.sloMapping.spec.stabilizationWindow,
                staticConfig: staticElasticityStrategyConfig,
            }),
        });
    }

}
