import { ObjectKind } from '../../../model';
import { IndexByKey, PolarisConstructor, PolarisMetadataUtils } from '../../../util';
import { PolarisTransformationMetadata } from '../../internal';
import { PolarisTransformationConfig, PolarisTransformer, UnknownObjectKindError } from '../common';
import { DefaultTransformer } from '../transformers';
import { PolarisTransformationService } from './sloc-transformation-service';

/**
 * The default implementation of the `PolarisTransformationService`.
 *
 * @note Please extend this class if you want to create your own `PolarisTransformationService`.
 */
export class DefaultPolarisTransformationService implements PolarisTransformationService {

    private _defaultTransformer: PolarisTransformer<any, any> = new DefaultTransformer<any>();

    private knownObjectKinds: IndexByKey<PolarisConstructor<any>> = {};

    get defaultTransformer(): PolarisTransformer<any, any> {
        return this._defaultTransformer;
    }

    changeDefaultTransformer(newDefaultTransformer: PolarisTransformer<any, any>): void {
        this._defaultTransformer = newDefaultTransformer;
    }

    registerTransformer<T>(slocType: PolarisConstructor<T>, transformer: PolarisTransformer<T, any>, config: PolarisTransformationConfig = {}): void {
        const transformMeta: PolarisTransformationMetadata<T> = {
            ...config,
            transformer,
            typeRegistered: slocType,
        };
        PolarisMetadataUtils.setPolarisTransformationMetadata(transformMeta, slocType);
    }

    registerObjectKind<T>(
        kind: ObjectKind,
        slocType: PolarisConstructor<T>,
        transformer?: PolarisTransformer<T, any>,
        config?: PolarisTransformationConfig,
    ): void {
        const kindStr = kind.toString();
        this.knownObjectKinds[kindStr] = slocType;

        if (transformer) {
            this.registerTransformer(slocType, transformer, config);
        }
    }

    transformToPolarisObject<T>(slocType: PolarisConstructor<T>, orchPlainObj: any): T;
    transformToPolarisObject(kind: ObjectKind, orchPlainObj: any): any;
    transformToPolarisObject<T = any>(slocTypeOrKind: PolarisConstructor<T> | ObjectKind, orchPlainObj: any): T {
        if (orchPlainObj === null || orchPlainObj === undefined) {
            return null;
        }

        let slocType: PolarisConstructor<T>;
        if (slocTypeOrKind instanceof Function) {
            slocType = slocTypeOrKind;
        } else {
            slocType = this.getPolarisType(slocTypeOrKind);
            if (!slocType) {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                throw new UnknownObjectKindError(slocTypeOrKind, orchPlainObj, `The ObjectKind '${slocTypeOrKind} has not been registered.`);
            }
        }

        const transformer = this.getTransformer(slocType);
        return transformer.transformToPolarisObject(slocType, orchPlainObj, this);
    }

    transformToOrchestratorPlainObject(slocObj: any): any {
        if (slocObj === null || slocObj === undefined) {
            return null;
        }

        const transformer = this.getTransformer(slocObj);
        return transformer.transformToOrchestratorPlainObject(slocObj, this);
    }

    getPropertyType<T>(slocType: PolarisConstructor<T>, propertyKey: keyof T & string): PolarisConstructor<any> {
        return PolarisMetadataUtils.getPropertyPolarisType(slocType, propertyKey);
    }

    getPolarisType(kind: ObjectKind): PolarisConstructor<any> {
        const kindStr = kind.toString();
        return this.knownObjectKinds[kindStr];
    }

    private getTransformer<T>(slocObjOrType: T | PolarisConstructor<T>): PolarisTransformer<T, any> {
        const transformMeta = PolarisMetadataUtils.getPolarisTransformationMetadata(slocObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

}
