import { JSONSchema7 } from 'json-schema';

/** Describes a type using JSON Schema. */
export type JsonSchema<T = any> = Omit<JSONSchema7, 'properties' | 'items'> & {
    properties?: { [K in keyof T]?: JsonSchema<T[K]>; };
    items?: JsonSchema<T> | JsonSchema<T>[];
};
