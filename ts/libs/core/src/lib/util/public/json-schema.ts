import { JSONSchema7 } from 'json-schema';

/** Describes a type using JSON Schema. */
export type JsonSchema<T = any> = Omit<JSONSchema7, 'properties' | 'items'> & {
    properties?: { [K in keyof T]?: JsonSchema<T[K]>; };
    items?: JsonSchema<T> | JsonSchema<T>[];
};

/**
 * Helper function to unwrap arbitrarily nested arrays and return the
 * actual content object type of the array.
 *
 * Example:
 *
 * ```yaml
 * nestedArray:
 *   type: array
 *   items:
 *     type: array
 *     items: # This object is returned as the unwrapped content schema.
 *       type: object
 *       properties:
 *         a:
 *           type: string
 * ```
 *
 * @param schema Any `JsonSchema` object
 * @returns A `JsonSchema` object that describes the type contained in the (possibly nested) array
 * or `schema` itself, if it is not an array schema.
 */
export function unwrapNestedArraySchema<T>(schema: JsonSchema): JsonSchema<T> {
    if (!schema) {
        return schema;
    }

    while (schema.type === 'array' && !Array.isArray(schema.items)) {
        schema = schema.items;
    }

    return schema;
}
