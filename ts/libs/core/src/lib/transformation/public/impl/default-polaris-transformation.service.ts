import { IndexByKey, JsonSchema,  PolarisConstructor, cloneDeepWithoutExcluded } from '../../../util';
import { PolarisMetadataUtils, PolarisTransformationMetadata } from '../../internal';
import { ObjectKind, PolarisTransformationConfig, PolarisTransformationServiceManager, PolarisTransformer, UnknownObjectKindError } from '../common';
import { DefaultTransformer } from './transformers';

/**
 * The default implementation of the {@link PolarisTransformationServiceManager}.
 *
 * @note Please extend this class if you want to create your own `PolarisTransformationService`.
 */
export class DefaultPolarisTransformationService implements PolarisTransformationServiceManager {

    private _defaultTransformer: PolarisTransformer<any, any> = new DefaultTransformer<any>();

    private knownObjectKinds: IndexByKey<PolarisConstructor<any>> = {};

    get defaultTransformer(): PolarisTransformer<any, any> {
        return this._defaultTransformer;
    }

    changeDefaultTransformer(newDefaultTransformer: PolarisTransformer<any, any>): void {
        this._defaultTransformer = newDefaultTransformer;
    }

    registerTransformer<T, P>(polarisType: PolarisConstructor<T>, transformer: PolarisTransformer<T, P>, config: PolarisTransformationConfig = {}): void {
        const transformMeta: PolarisTransformationMetadata<T> = {
            ...config,
            transformer,
            typeRegistered: polarisType,
        };
        PolarisMetadataUtils.setPolarisTransformationMetadata(transformMeta, polarisType);
    }

    registerObjectKind<T>(
        kind: ObjectKind,
        polarisType: PolarisConstructor<T>,
        transformer?: PolarisTransformer<T, any>,
        config?: PolarisTransformationConfig,
    ): void {
        const kindStr = ObjectKind.stringify(kind);
        this.knownObjectKinds[kindStr] = polarisType;

        if (transformer) {
            this.registerTransformer(polarisType, transformer, config);
        }
    }

    transformToPolarisObject<T>(polarisType: PolarisConstructor<T>, orchPlainObj: any): T;
    transformToPolarisObject<T>(polarisType: PolarisConstructor<T>, orchPlainObjArray: any[]): T[];
    transformToPolarisObject(kind: ObjectKind, orchPlainObj: any): any;
    transformToPolarisObject(kind: ObjectKind, orchPlainObjArray: any[]): any[];
    transformToPolarisObject<T = any>(polarisTypeOrKind: PolarisConstructor<T> | ObjectKind, orchPlainObj: any | any[]): T | T[] {
        if (orchPlainObj === null || orchPlainObj === undefined) {
            return null;
        }

        let polarisType: PolarisConstructor<T>;
        if (polarisTypeOrKind instanceof Function) {
            polarisType = polarisTypeOrKind;
        } else {
            polarisType = this.getPolarisType(polarisTypeOrKind);
            if (!polarisType) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new UnknownObjectKindError(polarisTypeOrKind, orchPlainObj, `The ObjectKind '${polarisTypeOrKind} has not been registered.`);
            }
        }

        const transformer = this.getTransformer(polarisType);

        if (Array.isArray(orchPlainObj)) {
            return orchPlainObj.map(obj => transformer.transformToPolarisObject(polarisType, obj, this));
        }
        return transformer.transformToPolarisObject(polarisType, orchPlainObj, this);
    }

    transformToOrchestratorPlainObject(polarisObj: any): any;
    transformToOrchestratorPlainObject(polarisObj: any[]): any[];
    transformToOrchestratorPlainObject(polarisObj: any | any[]): any[] {
        if (Array.isArray(polarisObj)) {
            return polarisObj.map(obj => this.transformSingleObjToOrchestratorPlainObj(obj));
        }
        return this.transformSingleObjToOrchestratorPlainObj(polarisObj);
    }

    transformToOrchestratorSchema<T>(polarisSchema: JsonSchema<T>, polarisType: PolarisConstructor<T>): JsonSchema<any> {
        if (polarisSchema === null || polarisSchema === undefined) {
            return null;
        }

        const transformer = this.getTransformer(polarisType);
        if (polarisSchema.type === 'array') {
            return this.transformArrayToOrchestratorSchema(polarisSchema, polarisType, transformer);
        } else {
            return transformer.transformToOrchestratorSchema(polarisSchema, polarisType, this);
        }
    }

    getPropertyType<T>(polarisType: PolarisConstructor<T>, propertyKey: keyof T & string): PolarisConstructor<any> {
        return PolarisMetadataUtils.getPropertyPolarisType(polarisType, propertyKey);
    }

    getPolarisType(kind: ObjectKind): PolarisConstructor<any> {
        const kindStr = ObjectKind.stringify(kind);
        return this.knownObjectKinds[kindStr];
    }

    private getTransformer<T>(polarisObjOrType: T | PolarisConstructor<T>): PolarisTransformer<T, any> {
        const transformMeta = PolarisMetadataUtils.getPolarisTransformationMetadata(polarisObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

    private transformSingleObjToOrchestratorPlainObj(polarisObj: any): any {
        if (polarisObj === null || polarisObj === undefined) {
            return null;
        }

        const transformer = this.getTransformer(polarisObj);
        return transformer.transformToOrchestratorPlainObject(polarisObj, this);
    }

    private transformArrayToOrchestratorSchema<T, R>(
        polarisSchema: JsonSchema<T>,
        polarisType: PolarisConstructor<T>,
        transformer: PolarisTransformer<T, R>,
    ): JsonSchema<R> {
        const transformedSchema: JsonSchema<R> = cloneDeepWithoutExcluded(polarisSchema, 'items') as any;

        if (Array.isArray(polarisSchema.items)) {
            transformedSchema.items = polarisSchema.items.map(
                objSchema => transformer.transformToOrchestratorSchema(objSchema, polarisType, this),
            );
        } else {
            transformedSchema.items = transformer.transformToOrchestratorSchema(polarisSchema.items, polarisType, this);
        }

        return transformedSchema;
    }

}
