import { ApiObjectMetadata, ComposedMetricMapping, ComposedMetricMappingSpec, ObjectKind, OwnerReference } from '../../../model';
import { OrchestratorClient } from '../../../runtime';
import { Logger, POLARIS_API, isValueEqual } from '../../../util';
import { ComposedMetricParams, ComposedMetricType } from '../common';
import { ComposedMetricMappingManager } from './composed-metric-mapping-manager';

/**
 * Default implementation of the {@link ComposedMetricMappingManager}, usable on all orchestrators.
 */
export class DefaultComposedMetricMappingManager implements ComposedMetricMappingManager {

    constructor(private client: OrchestratorClient) {}

    async ensureMappingExists<V, P extends ComposedMetricParams>(
        metricType: ComposedMetricType<V, P>,
        params: P,
    ): Promise<ComposedMetricMapping> {
        const kind = ComposedMetricMapping.getMappingObjectKind(metricType);

        let mapping = await this.fetchMetricMapping(kind, params);
        if (!mapping) {
            mapping = await this.createMetricMapping(kind, params);
            Logger.log('Successfully created ComposedMetricMapping', mapping);
        }

        if (this.checkAndUpdateMapping(mapping, params)) {
            mapping = await this.client.update(mapping);
            Logger.log('Successfully updated ComposedMetricMapping', mapping);
        }

        return mapping;
    }

    private async fetchMetricMapping(kind: ObjectKind, params: ComposedMetricParams): Promise<ComposedMetricMapping | undefined> {
        const query = new ComposedMetricMapping({
            objectKind: kind,
            metadata: new ApiObjectMetadata({
                namespace: params.namespace,
                name: params.owner.name,
            }),
        });

        return this.client.read(query)
            .catch(err => undefined);
    }

    private assembleMappingSpec<C extends ComposedMetricParams>(params: C): ComposedMetricMappingSpec<ComposedMetricParams> {
        const { sloTarget, namespace, owner, ...config } = params;
        const spec = new ComposedMetricMappingSpec();
        spec.metricConfig = config as any;
        spec.targetRef = sloTarget;
        return spec;
    }

    private setOwnerLabels(mapping: ComposedMetricMapping, owner: OwnerReference): void {
        if (!mapping.metadata.labels) {
            mapping.metadata.labels = {};
        }

        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_GROUP] = owner.group;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_VERSION] = owner.version;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_KIND] = owner.kind;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_NAME] = owner.name;
    }

    /**
     * Checks if the `existingMapping` matches the `params` and the `owner` and updates the `existingMapping`, if necessary.
     *
     * @returns `true`, if the `existingMapping` was updated and a write on the orchestrator is needed, otherwise `false`.
     */
    private checkAndUpdateMapping(existingMapping: ComposedMetricMapping, params: ComposedMetricParams): boolean {
        let updated = false;

        const newSpec = this.assembleMappingSpec(params);
        if (!isValueEqual(existingMapping.spec, newSpec)) {
            existingMapping.spec = newSpec;
            updated = true;
        }

        const existingOwner = existingMapping.getOwnerRef();
        let updateOwnerRef = existingOwner.group !== params.owner.group;
        updateOwnerRef = updateOwnerRef || existingOwner.version !== params.owner.version;
        updateOwnerRef = updateOwnerRef || existingOwner.kind !== params.owner.kind;
        updateOwnerRef = updateOwnerRef || existingOwner.name !== params.owner.name;
        if (updateOwnerRef) {
            existingMapping.setOwnerRef(params.owner);
            updated = true;
        }

        let updateLabels = existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_GROUP] !== params.owner.group;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_VERSION] !== params.owner.version;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_KIND] !== params.owner.kind;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_NAME] !== params.owner.name;
        if (updateLabels) {
            this.setOwnerLabels(existingMapping, params.owner);
            updated = true;
        }

        return updated;
    }

    private createMetricMapping(kind: ObjectKind, params: ComposedMetricParams): Promise<ComposedMetricMapping> {
        const mapping = new ComposedMetricMapping({
            objectKind: kind,
            metadata: new ApiObjectMetadata({
                namespace: params.namespace,
                name: params.owner.name,
            }),
            spec: this.assembleMappingSpec(params),
        });
        mapping.setOwnerRef(params.owner);
        this.setOwnerLabels(mapping, params.owner);

        return this.client.create(mapping);
    }

}
