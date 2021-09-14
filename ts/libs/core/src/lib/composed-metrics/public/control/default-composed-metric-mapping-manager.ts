import { isEqual } from 'lodash';
import { ApiObject, ApiObjectMetadata, ComposedMetricMapping, ComposedMetricMappingSpec, ObjectKind } from '../../../model';
import { OrchestratorClient } from '../../../runtime';
import { POLARIS_API, createOwnerReference } from '../../../util';
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
        owner: ApiObject<any>,
    ): Promise<ComposedMetricMapping> {
        const kind = ComposedMetricMapping.getMappingObjectKind(metricType);

        const existingMapping = await this.fetchMetricMapping(kind, owner);
        if (!existingMapping) {
            return this.createMetricMapping(kind, params, owner);
        }

        if (this.checkAndUpdateMapping(existingMapping, params, owner)) {
            return this.client.update(existingMapping);
        }
    }

    private async fetchMetricMapping(kind: ObjectKind, owner: ApiObject<any>): Promise<ComposedMetricMapping | undefined> {
        const query = new ComposedMetricMapping({
            objectKind: kind,
            metadata: new ApiObjectMetadata({
                namespace: owner.metadata.namespace,
                name: owner.metadata.name,
            }),
        });

        return this.client.read(query)
            .catch(err => undefined);
    }

    private assembleMappingSpec(params: ComposedMetricParams): ComposedMetricMappingSpec<ComposedMetricParams> {
        const { sloTarget, namespace, ...config } = params;
        const spec = new ComposedMetricMappingSpec();
        spec.metricConfig = config;
        spec.targetRef = sloTarget;
        return spec;
    }

    private setOwnerLabels(mapping: ComposedMetricMapping, owner: ApiObject<any>): void {
        if (!mapping.metadata.labels) {
            mapping.metadata.labels = {};
        }

        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_GROUP] = owner.objectKind.group;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_VERSION] = owner.objectKind.version;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_KIND] = owner.objectKind.kind;
        mapping.metadata.labels[POLARIS_API.LABEL_OWNER_NAME] = owner.metadata.name;
    }

    /**
     * Checks if the `existingMapping` matches the `params` and the `owner` and updates the `existingMapping`, if necessary.
     *
     * @returns `true`, if the `existingMapping` was updated and a write on the orchestrator is needed, otherwise `false`.
     */
    private checkAndUpdateMapping(existingMapping: ComposedMetricMapping, params: ComposedMetricParams, owner: ApiObject<any>): boolean {
        let updated = false;

        const newSpec = this.assembleMappingSpec(params);
        if (!isEqual(existingMapping.spec, newSpec)) {
            existingMapping.spec = newSpec;
            updated = true;
        }

        let updateLabels = existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_GROUP] !== owner.objectKind.group;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_API_VERSION] !== owner.objectKind.version;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_KIND] !== owner.objectKind.kind;
        updateLabels = updateLabels || existingMapping.metadata.labels[POLARIS_API.LABEL_OWNER_NAME] !== owner.metadata.name;
        if (updateLabels) {
            this.setOwnerLabels(existingMapping, owner);
            updated = true;
        }

        return updated;
    }

    private createMetricMapping(
        kind: ObjectKind,
        params: ComposedMetricParams,
        owner: ApiObject<any>,
    ): Promise<ComposedMetricMapping> {
        const mapping = new ComposedMetricMapping({
            objectKind: kind,
            metadata: new ApiObjectMetadata({
                namespace: owner.metadata.namespace,
                name: owner.metadata.name,
                ownerReferences: [ createOwnerReference(owner) ],
            }),
            spec: this.assembleMappingSpec(params),
        });
        this.setOwnerLabels(mapping, owner);

        return this.client.create(mapping);
    }

}
