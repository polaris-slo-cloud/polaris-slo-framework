import { cloneDeep } from 'lodash';
import { JsonSchema } from '../../../model';
import { Constructor } from '../../../util';
import { PolarisTransformationService } from '../service';

/** Describes a JsonSchema transformer function (same as PolarisTransformer.transformToOrchestratorSchema()). */
export type JsonSchemaTransformerFn<T, R = T> =
    (polarisSchema: JsonSchema<T>, polarisType: Constructor<T>, transformationService: PolarisTransformationService) => JsonSchema<R>;

/**
 * Transforms the JsonSchema of a Polaris type, according to its `JsonSchema.type` property.
 *
 * If `type === 'object'`, the `transformObjectSchemaFn` is used for transforming the entire schema.
 * If `type === 'array'`, the `transformObjectSchemaFn` is used for the transforming the schema's items.
 * In any other case, the `polarisSchema` is deeply cloned and returned.
 *
 * @param polarisSchema The JSON schema (without references) of the Polaris type.
 * @param polarisType The Polaris type, whose schema should be transformed.
 * @param transformationService The `PolarisTransformationService`.
 * @param transformObjectSchemaFn The function to use for transforming an object schema.
 * @returns A transformed JsonSchema.
 */
export function transformObjectOrArraySchema<T, R>(
    polarisSchema: JsonSchema<T>,
    polarisType: Constructor<T>,
    transformationService: PolarisTransformationService,
    transformObjectSchemaFn: JsonSchemaTransformerFn<T, R>,
): JsonSchema<R> {
    if (!polarisSchema) {
        return polarisSchema as any;
    }

    switch (polarisSchema.type) {
        case 'object':
            return transformObjectSchemaFn(polarisSchema, polarisType, transformationService);
        case 'array':
            return transformArrayToOrchestratorSchema(polarisSchema, polarisType, transformationService, transformObjectSchemaFn);
        default:
            return cloneDeep(polarisSchema) as any;
    }
}

function transformArrayToOrchestratorSchema<T, R>(
    polarisSchema: JsonSchema<T>,
    polarisType: Constructor<T>,
    transformationService: PolarisTransformationService,
    transformObjectSchemaFn: JsonSchemaTransformerFn<T, R>,
): JsonSchema<R> {
    const transformedSchema: JsonSchema<R> = { ...polarisSchema } as any;

    if (Array.isArray(polarisSchema.items)) {
        transformedSchema.items = polarisSchema.items.map(
            objSchema => transformObjectSchemaFn(objSchema, polarisType, transformationService),
        );
    } else {
        transformedSchema.items = transformObjectSchemaFn(polarisSchema.items, polarisType, transformationService);
    }

    return transformedSchema;
}
