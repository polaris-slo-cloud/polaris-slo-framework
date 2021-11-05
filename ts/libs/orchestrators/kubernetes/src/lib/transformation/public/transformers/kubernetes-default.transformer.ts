import { Constructor, DefaultTransformer, JsonSchema, PolarisTransformationService } from '@polaris-sloc/core';

const DEFAULT_INT_FORMAT = 'int64';

/**
 * Default transformer for the Kubernetes orchestrator.
 *
 * This extends the Polaris {@link DefaultTransformer} by augmenting `transformToOrchestratorSchema()` to convert all
 * properties of `type: number` to `type: integer` by default.
 */
export class KubernetesDefaultTransformer<T> extends DefaultTransformer<T> {

    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<T>,
        polarisType: Constructor<T>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<any> {
        const transformed = super.transformToOrchestratorSchema(polarisSchema, polarisType, transformationService);
        if (!transformed.properties) {
            return transformed;
        }

        // Convert all `type: number` to int64 by default.
        const propKeys = Object.keys(transformed.properties);
        propKeys.forEach(propKey => {
            const propSchema = transformed.properties[propKey];
            if (typeof propSchema !== 'object') {
                return;
            }
            if (propSchema.type === 'number') {
                propSchema.type = 'integer';
                propSchema.format = DEFAULT_INT_FORMAT;
            }
        });

        return transformed;
    }

}
