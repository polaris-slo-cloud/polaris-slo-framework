import { ObjectKind } from '../../../model';
import { IndexByKey, SlocConstructor, SlocMetadataUtils } from '../../../util';
import { SlocTransformationMetadata } from '../../internal';
import { SlocTransformationConfig, SlocTransformer, UnknownObjectKindError } from '../common';
import { DefaultTransformer } from '../transformers';
import { SlocTransformationService } from './sloc-transformation-service';

/**
 * The default implementation of the `SlocTransformationService`.
 *
 * @note Please extend this class if you want to create your own `SlocTransformationService`.
 */
export class DefaultSlocTransformationService implements SlocTransformationService {

    private _defaultTransformer: SlocTransformer<any, any> = new DefaultTransformer<any>();

    private knownObjectKinds: IndexByKey<SlocConstructor<any>> = {};

    get defaultTransformer(): SlocTransformer<any, any> {
        return this._defaultTransformer;
    }

    changeDefaultTransformer(newDefaultTransformer: SlocTransformer<any, any>): void {
        this._defaultTransformer = newDefaultTransformer;
    }

    registerTransformer<T>(slocType: SlocConstructor<T>, transformer: SlocTransformer<T, any>, config: SlocTransformationConfig = {}): void {
        const transformMeta: SlocTransformationMetadata<T> = {
            ...config,
            transformer,
            typeRegistered: slocType,
        };
        SlocMetadataUtils.setSlocTransformationMetadata(transformMeta, slocType);
    }

    registerObjectKind<T>(kind: ObjectKind, slocType: SlocConstructor<T>, transformer?: SlocTransformer<T, any>, config?: SlocTransformationConfig): void {
        const kindStr = kind.toString();
        this.knownObjectKinds[kindStr] = slocType;

        if (transformer) {
            this.registerTransformer(slocType, transformer, config);
        }
    }

    transformToSlocObject<T>(slocType: SlocConstructor<T>, orchPlainObj: any): T;
    transformToSlocObject(kind: ObjectKind, orchPlainObj: any): any;
    transformToSlocObject<T = any>(slocTypeOrKind: SlocConstructor<T> | ObjectKind, orchPlainObj: any): T {
        if (orchPlainObj === null || orchPlainObj === undefined) {
            return null;
        }

        let slocType: SlocConstructor<T>;
        if (slocTypeOrKind instanceof Function) {
            slocType = slocTypeOrKind;
        } else {
            slocType = this.getSlocType(slocTypeOrKind);
            if (!slocType) {
                throw new UnknownObjectKindError(slocTypeOrKind, orchPlainObj, `The ObjectKind '${slocTypeOrKind} has not been registered.`);
            }
        }

        const transformer = this.getTransformer(slocType);
        return transformer.transformToSlocObject(slocType, orchPlainObj, this);
    }

    transformToOrchestratorPlainObject(slocObj: any): any {
        if (slocObj === null || slocObj === undefined) {
            return null;
        }

        const transformer = this.getTransformer(slocObj);
        return transformer.transformToOrchestratorPlainObject(slocObj, this);
    }

    getPropertyType<T>(slocType: SlocConstructor<T>, propertyKey: keyof T & string): SlocConstructor<any> {
        return SlocMetadataUtils.getPropertySlocType(slocType, propertyKey);
    }

    getSlocType(kind: ObjectKind): SlocConstructor<any> {
        const kindStr = kind.toString();
        return this.knownObjectKinds[kindStr];
    }

    private getTransformer<T>(slocObjOrType: T | SlocConstructor<T>): SlocTransformer<T, any> {
        const transformMeta = SlocMetadataUtils.getSlocTransformationMetadata(slocObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

}
