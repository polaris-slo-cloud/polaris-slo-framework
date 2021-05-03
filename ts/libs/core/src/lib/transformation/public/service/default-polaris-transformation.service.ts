import { ObjectKind } from '../../../model';
import { IndexByKey, PolarisConstructor, PolarisMetadataUtils } from '../../../util';
import { PolarisTransformationMetadata } from '../../internal';
import { PolarisTransformationConfig, PolarisTransformer, UnknownObjectKindError } from '../common';
import { DefaultTransformer } from '../transformers';
import { PolarisTransformationService } from './polaris-transformation-service';

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

    registerTransformer<T>(polarisType: PolarisConstructor<T>, transformer: PolarisTransformer<T, any>, config: PolarisTransformationConfig = {}): void {
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
        const kindStr = kind.toString();
        this.knownObjectKinds[kindStr] = polarisType;

        if (transformer) {
            this.registerTransformer(polarisType, transformer, config);
        }
    }

    transformToPolarisObject<T>(polarisType: PolarisConstructor<T>, orchPlainObj: any): T;
    transformToPolarisObject(kind: ObjectKind, orchPlainObj: any): any;
    transformToPolarisObject<T = any>(polarisTypeOrKind: PolarisConstructor<T> | ObjectKind, orchPlainObj: any): T {
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
        return transformer.transformToPolarisObject(polarisType, orchPlainObj, this);
    }

    transformToOrchestratorPlainObject(polarisObj: any): any {
        if (polarisObj === null || polarisObj === undefined) {
            return null;
        }

        const transformer = this.getTransformer(polarisObj);
        return transformer.transformToOrchestratorPlainObject(polarisObj, this);
    }

    getPropertyType<T>(polarisType: PolarisConstructor<T>, propertyKey: keyof T & string): PolarisConstructor<any> {
        return PolarisMetadataUtils.getPropertyPolarisType(polarisType, propertyKey);
    }

    getPolarisType(kind: ObjectKind): PolarisConstructor<any> {
        const kindStr = kind.toString();
        return this.knownObjectKinds[kindStr];
    }

    private getTransformer<T>(polarisObjOrType: T | PolarisConstructor<T>): PolarisTransformer<T, any> {
        const transformMeta = PolarisMetadataUtils.getPolarisTransformationMetadata(polarisObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

}
