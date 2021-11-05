import * as jsonSchemaToOpenApi from '@openapi-contrib/json-schema-to-openapi-schema';
import { JsonSchema, OpenApiSchema, PolarisRuntime } from '@polaris-sloc/core';
import { Resolver } from '@stoplight/json-ref-resolver';
import { cloneDeep } from 'lodash';
import { DEFAULT_CONFIG as TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG, createGenerator } from 'ts-json-schema-generator';
import { SchemaGeneratorConfig } from './config';
import { OpenApiGeneratorError } from './errors';

/**
 * Generates schemas for Polaris types.
 *
 * **Important:** Does not work in a webpack bundled application with no external dependencies,
 * because the ECMAScript .d.ts files included with TypeScript would not be bundled by default.
 * Thus, `ts-json-schema-generator` and `typescript` **must** be external dependencies (i.e.,
 * installed in node_modules).
 */
export class SchemaGenerator {

    private resolver = new Resolver();

    /**
     * @param polarisRuntime The {@link PolarisRuntime} instance that provides the `PolarisTransformationService`.
     */
    constructor(private polarisRuntime: PolarisRuntime) {}

    /**
     * Generates an orchestrator-specific JSON Schema for a Polaris type.
     *
     * @param config Specifies which TypeScript project to inspect and which type to generate the schema for.
     * @returns A JSON Schema for the specified type that has been transformed for the current orchestrator
     * or throws an error if the type cannot be found or in case of other problems.
     */
    async generateJsonSchema(config: SchemaGeneratorConfig): Promise<JsonSchema> {
        try {
            return await this.generateJsonSchemaInternal(config);
        } catch (err) {
            if (err instanceof OpenApiGeneratorError) {
                throw err;
            }
            throw new OpenApiGeneratorError('Error while generating JSON Schema', config, this.polarisRuntime, err);
        }
    }

    /**
     * Generates an OpenAPI v3 Schema for a Polaris type.
     *
     * @note This does not generate a complete OpenAPI spec, which would describe an entire API.
     * Instead only a schema that describes a single type is generated.
     *
     * @param config Specifies which TypeScript project to inspect and which type to generate the schema for.
     * @returns An OpenApiSchema for the specified type or throws an error if the type cannot be found or
     * in case of other problems.
     */
    async generateOpenApiSchema(config: SchemaGeneratorConfig): Promise<OpenApiSchema> {
        try {
            return await this.generateOpenApiSchemaInternal(config);
        } catch (err) {
            if (err instanceof OpenApiGeneratorError) {
                throw err;
            }
            throw new OpenApiGeneratorError('Error while generating OpenAPI Schema', config, this.polarisRuntime, err);
        }
    }

    private async generateOpenApiSchemaInternal(config: SchemaGeneratorConfig): Promise<OpenApiSchema> {
        const jsonSchema = await this.generateJsonSchemaInternal(config);
        const openApiSchema = await this.convertJsonSchemaToOpenApi(jsonSchema);
        return openApiSchema;
    }

    /**
     * Generates an orchestrator-specific JSON schema without any references, i.e., all properties contain nested schemas.
     */
    private async generateJsonSchemaInternal(config: SchemaGeneratorConfig): Promise<JsonSchema> {
        const typeName = config.polarisType.name;
        const origJsonSchema = createGenerator({
            ...TS_JSON_SCHEMA_GEN_DEFAULT_CONFIG,
            tsconfig: config.tsConfig,
            path: config.tsIndexFile,
            type: typeName,
            jsDoc: 'extended',
            skipTypeCheck: false,
            topRef: false,
        }).createSchema(typeName);

        const resolveResult = await this.resolver.resolve(origJsonSchema);
        const jsonSchemaResolved: JsonSchema = cloneDeep(resolveResult.result);
        delete jsonSchemaResolved.$ref;
        delete jsonSchemaResolved.definitions;

        const orchestratorJsonSchema = this.polarisRuntime.transformer.transformToOrchestratorSchema(jsonSchemaResolved, config.polarisType);
        return orchestratorJsonSchema;
    }

    /**
     * Converts the JSON schema to an Open API schema and resolves all JSON references.
     */
    private async convertJsonSchemaToOpenApi(jsonSchema: JsonSchema): Promise<OpenApiSchema> {
        // Need to manually define the Promise type, because the typing of jsonSchemaToOpenApi() is incorrect.
        const transformToOpenApi: Promise<OpenApiSchema> = jsonSchemaToOpenApi(jsonSchema, { dereference: true, cloneSchema: true });
        const openApiSchemaWithRefs = await transformToOpenApi;

        const openApiSchemaNoRefs = await this.resolver.resolve(openApiSchemaWithRefs);
        const result: OpenApiSchema = cloneDeep(openApiSchemaNoRefs.result);
        delete (result as any as JsonSchema).definitions;
        return result;
    }

}
