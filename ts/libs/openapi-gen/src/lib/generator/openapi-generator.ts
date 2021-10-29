import * as fs from 'fs';
import * as jsonSchemaToOpenApi from '@openapi-contrib/json-schema-to-openapi-schema';
import { Resolver } from '@stoplight/json-ref-resolver';
import { cloneDeep } from 'lodash';
import { OpenAPIV3 } from 'openapi-types';
import { Schema as JsonSchema, DEFAULT_CONFIG as TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG, createGenerator } from 'ts-json-schema-generator';
import { SchemaGeneratorConfig } from './config';
import { OpenApiGeneratorError } from './errors';

export type OpenApiSchema = OpenAPIV3.BaseSchemaObject;

/**
 * Generates an OpenAPI v3 Schema for a Polaris type.
 *
 * **Important:** Does not work in a webpack bundled application with no external dependencies,
 * because the ECMAScript .d.ts files included with TypeScript would not be bundled by default.
 * Thus, `ts-json-schema-generator` and `typescript` **must** be external dependencies (i.e.,
 * installed in node_modules).
 *
 * @note This does not generate a complete OpenAPI spec, which would describe an entire API.
 * Instead only a schema that describes a single type is generated.
 *
 * @param config Specifies which TypeScript project to inspect and which type to generate the schema for.
 * @returns An OpenApiSchema for the specified type or throws an error if the type cannot be found or
 * in case of other problems.
 */
export async function generateOpenApiSchema(config: SchemaGeneratorConfig): Promise<OpenApiSchema> {
    try {
        return await generateOpenApiSchemaInternal(config);
    } catch (err) {
        if (err instanceof OpenApiGeneratorError) {
            throw err;
        }
        throw new OpenApiGeneratorError('Error while generating OpenAPI Schema', config, err);
    }

}

async function generateOpenApiSchemaInternal(config: SchemaGeneratorConfig): Promise<OpenApiSchema> {
    const origJsonSchema = createGenerator({
        ...TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG,
        tsconfig: config.tsConfig,
        path: config.tsIndexFile,
        type: config.typeName,
        jsDoc: 'extended',
        skipTypeCheck: false,
        topRef: true,
    }).createSchema(config.typeName);

// Here we could do transformation on the single types (probably best to do it on the JSON Schema).
    // Options: (all must do at least the transformations from the manual option and also remove any properties from the `required` array)
    // - Add transformSchema(jsonSchema, currType) to PolarisTransformer
    // - Add the above only to a new KubernetesPolarisTransformer subinterface
    // - Manually (in this file) i) remove objectKind, ii) change type of metadata to object, and iii) add apiVersion and kind properties to the root object.

    // Resolve the top-level $ref to our target type.
    const jsonSchemaNoTopLevelRef: JsonSchema = cloneDeep(origJsonSchema);
    Object.assign(jsonSchemaNoTopLevelRef, origJsonSchema.definitions[config.typeName]);
    delete jsonSchemaNoTopLevelRef.$ref;

    const openApiSchema = await convertJsonSchemaToOpenApi(jsonSchemaNoTopLevelRef);
// fs.writeFileSync('./openApiSchemaWithRefs.json', JSON.stringify(openApiSchema, null, 4));

    const resolver = new Resolver();
    const openApiSchemaNoRefs = await resolver.resolve(openApiSchema);
    const result: OpenApiSchema = cloneDeep(openApiSchemaNoRefs.result);
    delete (result as any as JsonSchema).definitions;

// fs.writeFileSync('./openApiSchemaFinal.json', JSON.stringify(result, null, 4));
    return openApiSchema;

// ToDo: Remove NestJS stuff from package.json, angular.json, and generators.
}

function convertJsonSchemaToOpenApi(jsonSchema: JsonSchema): Promise<OpenApiSchema> {
    return jsonSchemaToOpenApi(jsonSchema, { dereference: true, cloneSchema: true });
}
