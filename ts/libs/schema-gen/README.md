# @polaris-sloc/schema-gen

This library supports the generation of various schemas from TypeScript code.

For more information, please visit the Polaris framework's [website](https://polaris-slo-cloud.github.io).


## JSON Schema Generation

This library relies on the [ts-json-schema-generator](https://www.npmjs.com/package/ts-json-schema-generator) package, which leverages the TypeScript compiler API to generate a JSON Schema.
@polaris-sloc/schema-gen then applies transformations to that orchestrator-independent schema to match the needs of a specific orchestrator.


## OpenAPI v3 Specification Generation

To generate an OpenAPI v3 schema, we first generate a JSON schema and then transform it to an OpenAPI v3 schema using the [@openapi-contrib/json-schema-to-openapi-schema](https://www.npmjs.com/package/@openapi-contrib/json-schema-to-openapi-schema) package.
If an OpenAPI v3.1 schema is needed, the JSON Schema can be used directly.
