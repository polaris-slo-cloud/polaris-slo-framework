import { JSONSchema7 } from 'json-schema';
import { OpenAPIV3 } from 'openapi-types';
import { PolarisType } from '../transformation';
import { initSelf } from '../util';
import { ApiObject } from './api-object.prm';
import { ObjectKind } from './object-kind.prm';

/** Describes a type using an OpenAPI v3 schema. */
export type OpenApiSchema = OpenAPIV3.BaseSchemaObject;

/** Describes a type using JSON Schema. */
export type JsonSchema<T = any> = Omit<JSONSchema7, 'properties' | 'items'> & {
    properties?: { [K in keyof T]?: JsonSchema<T[K]>; };
    items?: JsonSchema<T> | JsonSchema<T>[];
};

/**
 * Describes a custom {@link ApiObject} type.
 *
 * @note The `ApiMetadata.name` for a CRD must be of the form `<crd.spec.names.plural>.<crd.spec.group`.
 */
export class CustomResourceDefinitionSpec {

    /**
     * The API group of the {@link ApiObject} type that this CRD describes.
     *
     * @see ObjectKind.group
     *
     * @example elasticity.polaris-slo-cloud.github.io
     */
    group: string;

    /**
     * Describes if instances of the CRD can be created within a namespace or
     * in a cluster-wide scope.
     */
    scope: 'Namespaced' | 'Cluster';

    /**
     * All recognized names for this CRD.
     */
    names: CrdNames;

    /**
     * List of all supported versions of this CRD.
     */
    versions: CrdVersion[];

    constructor(initData?: Partial<CustomResourceDefinitionSpec>) {
        initSelf(this, initData);
    }

}

/**
 * All recognized names for a CRD.
 */
export interface CrdNames {

    /**
     * The kind used to identify the {@link ApiObject} type described by this CRD.
     * This is later used in {@link ObjectKind} objects.
     *
     * @example HorizontalElasticityStrategy
     */
    kind: string;

    /**
     * The kind of the list type used for retrieving/storing lists of the {@link ApiObject} type.
     *
     * @example HorizontalElasticityStrategyList
     */
    listKind: string;

    /**
     * Lowercase singular version of the {@link ApiObject} type described by this CRD.
     *
     * @example horizontalelasticitystrategy
     */
    singular: string;

    /**
     * Lowercase plural version of the {@link ApiObject} type described by this CRD.
     *
     * @example horizontalelasticitystrategies
     */
    plural: string;

    /**
     * (optional) Short names of the {@link ApiObject} type described by this CRD for CLI usage.
     */
    shortNames?: string[];

}

/**
 * Describes the schema of a single version of a Custom Resource Definition.
 */
export interface CrdVersion {

    /**
     * Name of this CRD version.
     *
     * @example v1
     */
    name: string;

    /**
     * If `true`, this version is enabled.
     * If `false`, this version is disabled.
     */
    served: boolean;

    /**
     * Only one version can be marked for storage.
     */
    storage: boolean;

    /**
     * The schema of this CRD version.
     */
    schema: CrdSchema;

}

/**
 * Stores the schema of a CRD.
 */
export interface CrdSchema {

    /**
     * The OpenAPI v3 schema of this CRD version.
     */
    openAPIV3Schema: OpenApiSchema;

}

/**
 * Represents the definition of a custom {@link ApiObject} type.
 *
 * @note The `ApiMetadata.name` for a CRD must be of the form `<crd.spec.names.plural>.<crd.spec.group`.
 */
export class CustomResourceDefinition extends ApiObject<CustomResourceDefinitionSpec> {

    @PolarisType(() => CustomResourceDefinitionSpec)
    spec: CustomResourceDefinitionSpec;

    constructor(initData?: Partial<CustomResourceDefinition>) {
        super(initData);
        this.objectKind = new ObjectKind({
            group: 'apiextensions.k8s.io',
            version: 'v1',
            kind: 'CustomResourceDefinition',
        });
        initSelf(this, initData);
    }

}
