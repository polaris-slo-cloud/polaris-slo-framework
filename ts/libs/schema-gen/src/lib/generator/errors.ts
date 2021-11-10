import { PolarisRuntime } from '@polaris-sloc/core';
import { SchemaGeneratorConfig } from './config';

/**
 * Error type thrown during problems with the Schema generation.
 */
export class SchemaGeneratorError extends Error {

    constructor(
        message: string,
        public generatorConfig: SchemaGeneratorConfig,
        public polarisRuntime: PolarisRuntime,
        public reason?: any,
    ) {
        super(message);
    }

}
