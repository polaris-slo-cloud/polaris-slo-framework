import * as fs from 'fs/promises';
import * as path from 'path';
import { IndexByKey, PolarisConstructor, PolarisRuntime } from '@polaris-sloc/core';
import * as Yaml from 'js-yaml';
import { CustomResourceDefinitionGenerator, SchemaGeneratorConfig } from '../generator';

export interface CrdWriterConfig extends Omit<SchemaGeneratorConfig, 'polarisType'> {

    /**
     * The output directory, where the CRDs should be saved.
     */
    outDir: string;

    /**
     * The Polaris types, for which to generate the CRDs.
     */
    polarisTypes: PolarisConstructor<any>[];

}

/**
 * Utility class for generating CRDs and writing them to output files.
 */
export class CustomResourceDefinitionWriter {

    private crdGen: CustomResourceDefinitionGenerator;

    /**
     * @param polarisRuntime The {@link PolarisRuntime} instance that provides the `PolarisTransformationService`.
     */
    constructor(private polarisRuntime: PolarisRuntime) {
        this.crdGen = new CustomResourceDefinitionGenerator(polarisRuntime);
    }

    /**
     * Generates CRDs for multiple Polaris types and saves them to an output directory..
     *
     * @param config Specifies which TypeScript project to inspect and for which types to generate the CRDs.
     * @returns A promise that resolves to a map that associates the name of each Polaris type with the path of the CRD file that has been written
     * or rejects with an error.
     */
    async generateAndWriteCrds(config: CrdWriterConfig): Promise<IndexByKey<string>> {
        const writtenFiles: IndexByKey<string> = {};

        for (const polarisType of config.polarisTypes) {
            console.log('Generating CRD for ', polarisType.name);

            const outPath = await this.generateAndWriteCrd({
                tsConfig: config.tsConfig,
                tsIndexFile: config.tsIndexFile,
                polarisType,
            }, config.outDir);

            writtenFiles[polarisType.name] = outPath;
        }

        return writtenFiles;
    }

    private async generateAndWriteCrd(config: SchemaGeneratorConfig, outDir: string): Promise<string> {
        const crd = await this.crdGen.generateCrd(config);
        const nativeCrd = this.polarisRuntime.transformer.transformToOrchestratorPlainObject(crd);
        const crdYaml = Yaml.dump(nativeCrd, { indent: 2 });

        await fs.mkdir(outDir, { recursive: true });
        const outPath = path.join(outDir, `${crd.metadata.name}.yaml`);
        await fs.writeFile(outPath, crdYaml);
        return outPath;
    }

}
