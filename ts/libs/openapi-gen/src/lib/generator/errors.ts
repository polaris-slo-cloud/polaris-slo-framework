import { SchemaGeneratorConfig } from './config';

/**
 * Error type thrown during problems with the OpenAPI spec generation.
 */
export class OpenApiGeneratorError extends Error {

    constructor(
        message: string,
        public generatorConfig: SchemaGeneratorConfig,
        public reason?: any,
    ) {
        super(message);
    }

}
