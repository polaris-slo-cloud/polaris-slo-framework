import { ObjectKind } from '../../../model';
import { Constructor, IndexByKey, SlocMetadataUtils } from '../../../util';
import { SlocTransformationMetadata } from '../../internal';
import { OrchestratorToSlocTransformationError, SlocTransformationConfig, SlocTransformer, UnknownObjectKindError } from '../common';
import { DefaultTransformer } from '../transformers';
import { SlocTransformationService } from './sloc-transformation-service';

/**
 * The default implementation of the `SlocTransformationService`.
 *
 * @note Please extend this class if you want to create your own `SlocTransformationService`.
 */
export class DefaultSlocTransformationService implements SlocTransformationService {

    private _defaultTransformer: SlocTransformer<any, any> = new DefaultTransformer<any>();

    private knownObjectKinds: IndexByKey<Constructor<any>> = {};

    get defaultTransformer(): SlocTransformer<any, any> {
        return this._defaultTransformer;
    }

    changeDefaultTransformer(newDefaultTransformer: SlocTransformer<any, any>): void {
        this._defaultTransformer = newDefaultTransformer;
    }

    registerTransformer<T>(slocType: Constructor<T>, transformer: SlocTransformer<T, any>, config: SlocTransformationConfig = {}): void {
        const transformMeta: SlocTransformationMetadata<T> = {
            ...config,
            transformer,
            typeRegistered: slocType,
        };
        SlocMetadataUtils.setSlocTransformationMetadata(transformMeta, slocType);
    }

    registerObjectKind<T>(kind: ObjectKind, slocType: Constructor<T>, transformer?: SlocTransformer<T, any>, config?: SlocTransformationConfig): void {
        const kindStr = kind.toString();
        this.knownObjectKinds[kindStr] = slocType;

        if (transformer) {
            this.registerTransformer(slocType, transformer, config);
        }
    }

    transformToSlocObject<T>(slocType: Constructor<T>, orchPlainObj: any): T;
    transformToSlocObject(kind: ObjectKind, orchPlainObj: any): any;
    transformToSlocObject<T = any>(slocTypeOrKind: Constructor<T> | ObjectKind, orchPlainObj: any): T {
        if (orchPlainObj === null || orchPlainObj === undefined) {
            return null;
        }

        let slocType: Constructor<T>;
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

    getPropertyType<T>(slocType: Constructor<T>, propertyKey: keyof T & string): Constructor<any> {
        return SlocMetadataUtils.getPropertySlocType(slocType, propertyKey);
    }

    private getSlocType(kind: ObjectKind): Constructor<any> {
        const kindStr = kind.toString();
        return this.knownObjectKinds[kindStr];
    }

    private getTransformer<T>(slocObjOrType: T | Constructor<T>): SlocTransformer<T, any> {
        const transformMeta = SlocMetadataUtils.getSlocTransformationMetadata(slocObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

}
