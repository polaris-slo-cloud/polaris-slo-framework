import {
    ApiObject,
    ApiObjectMetadata,
    CrdNames,
    CustomResourceDefinition,
    CustomResourceDefinitionSpec,
    ObjectKind,
    POLARIS_API,
    PolarisRuntime,
    getPlural,
} from '@polaris-sloc/core';
import { version as polarisVersion } from '../../../package.json';
import { SchemaGeneratorConfig } from './config';
import { SchemaGeneratorError } from './errors';
import { SchemaGenerator } from './schema-generator';

/**
 * Generates {@link CustomResourceDefinition} objects from Polaris types.
 */
export class CustomResourceDefinitionGenerator {

    private schemaGen: SchemaGenerator;

    /**
     * @param polarisRuntime The {@link PolarisRuntime} instance that provides the `PolarisTransformationService`.
     */
    constructor(private polarisRuntime: PolarisRuntime) {
        this.schemaGen = new SchemaGenerator(polarisRuntime);
    }

    /**
     * Generates a {@link CustomResourceDefinition} for a Polaris type, with a type schema
     * that has been transformed for the currently configured orchestrator.
     *
     * @param config Specifies which TypeScript project to inspect and which type to generate the CRD for.
     * @returns A {@link CustomResourceDefinition} for the specified type, whose schema has been transformed for the current orchestrator
     * or throws an error if the type cannot be found or in case of other problems.
     */
    async generateCrd(config: SchemaGeneratorConfig): Promise<CustomResourceDefinition> {
        const prototype: ApiObject<any> = new config.polarisType();
        if (!prototype.objectKind?.kind || !prototype.objectKind.group || !prototype.objectKind.version) {
            throw new SchemaGeneratorError('An ApiObject must initialize its objectKind property in the default constructor.', config, this.polarisRuntime);
        }

        const crdNames = this.generateCrdNames(prototype.objectKind);
        const schema = await this.schemaGen.generateOpenApiSchema(config);
        const crdObjName = `${crdNames.plural}.${prototype.objectKind.group}`

        const crd: CustomResourceDefinition = new CustomResourceDefinition({
            metadata: new ApiObjectMetadata({
                annotations: {
                    [POLARIS_API.ANNOTATION_CRD_GENERATOR_VERSION]: polarisVersion,
                },
                name: crdObjName,
            }),
            spec: new CustomResourceDefinitionSpec({
                group: prototype.objectKind.group,
                names: crdNames,
                scope: 'Namespaced',
                versions: [
                    {
                        name: prototype.objectKind.version,
                        served: true,
                        storage: true,
                        schema: { openAPIV3Schema: schema },
                    },
                ],
            }),
        });

        return crd;
    }

    private generateCrdNames(objectKind: ObjectKind): CrdNames {
        const singular = objectKind.kind.toLowerCase();
        return {
            kind: objectKind.kind,
            listKind: objectKind.kind + 'List',
            singular,
            plural: getPlural(singular),
        };
    }

}
