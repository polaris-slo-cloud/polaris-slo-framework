import { SloOutput } from '../slo/public/common/slo-output';
import { SlocType } from '../transformation';
import { initSelf } from '../util';
import { ApiObject } from './api-object';
import { ApiObjectMetadata } from './api-object-metadata';
import { ObjectKind } from './object-kind';
import { SloTarget } from './slo-target';

/**
 * A generic class that is used to set up specs for an elasticity strategy.
 *
 * All elasticity strategies should adhere to this class' layout.
 *
 * Parameters that are defined by the output of the SLO are stored in `sloOutputParams`.
 * The type of this property determines if an elasticity strategy is compatible with a certain SLO.
 *
 * `staticConfig` should be used for other configuration data, which is not changed by the SLO.
 */
export class ElasticityStrategySpec<T> {

    /** Specifies the target on which to execute the elasticity strategy. */
    @SlocType(() => SloTarget)
    targetRef: SloTarget;

    /**
     * The output parameters from the last `ServiceLevelObjective.evaluate()` call.
     */
    sloOutputParams: T;

    /**
     * Static configuration that was supplied using `SloMappingSpec.staticElasticityStrategyConfig`.
     */
    staticConfig?: any;

    constructor(initData?: Partial<ElasticityStrategySpec<T>>) {
        initSelf(this, initData);
    }

}

/**
 * Used to submit/retrieve an elasticity strategy to/from the orchestrator.
 */
export class ElasticityStrategy<T> extends ApiObject<ElasticityStrategySpec<T>> {

    @SlocType(() => ElasticityStrategySpec)
    spec: ElasticityStrategySpec<T>;

    /**
     * Creates a new `ElasticityStrategy` based on the `sloOutput`.
     *
     * This sets up the elasticity strategy kind, the SLO target ref, and the elasticity strategy spec automatically.
     *
     * @param name The name that should be assigned to `metadata.name`.
     * @param sloOutput The SLO ouput that should be used for setting up this `ElaticityStrategy`.
     * @returns A new `ElasticityStrategy` instance.
     */
    static fromSloOutput<T>(name: string, sloOutput: SloOutput<T>): ElasticityStrategy<T> {
        return new ElasticityStrategy({
            objectKind: new ObjectKind(sloOutput.spec.elasticityStrategy),
            metadata: new ApiObjectMetadata({
                name,
            }),
            spec: new ElasticityStrategySpec({
                targetRef: sloOutput.spec.targetRef,
                sloOutputParams: sloOutput.elasticityStrategyParams,
                staticConfig: sloOutput.spec.staticElasticityStrategyConfig,
            }),
        });
    }

    constructor(initData?: Partial<ElasticityStrategy<T>>) {
        super(initData);
    }

}
