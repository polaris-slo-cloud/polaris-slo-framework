import { Constructor, SlocMetadataUtils } from '../../../util';
import { SlocTransformationMetadata } from '../../internal';
import { SlocTransformer } from '../sloc-transformer';
import { DefaultTransformer } from '../transformers';
import { SlocTransformationService } from './sloc-transformation-service';

/**
 * The default implementation of the `SlocTransformationService`.
 *
 * @note Please extend this class if you want to create your own `SlocTransformationService`.
 */
export class DefaultSlocTransformationService implements SlocTransformationService {

    private defaultTransformer: SlocTransformer<any, any> = new DefaultTransformer<any>();

    registerTransformer<T>(slocType: Constructor<T>, transformer: SlocTransformer<T, any>): void {
        const transformMeta: SlocTransformationMetadata<T> = {
            transformer,
        };
        SlocMetadataUtils.setSlocTransformationMetadata(transformMeta, slocType);
    }

    transformToSlocObject<T>(slocType: Constructor<T>, orchPlainObj: any): T {
        const transformer = this.getTransformer(slocType);
        return transformer.transformToSlocObject(slocType, orchPlainObj, this);
    }

    transformToOrchestratorPlainObject(slocObj: any): any {
        const transformer = this.getTransformer(slocObj);
        return transformer.transformToOrchestratorPlainObject(slocObj, this);
    }

    private getTransformer<T>(slocObjOrType: T | Constructor<T>): SlocTransformer<T, any> {
        const transformMeta = SlocMetadataUtils.getSlocTransformationMetadata(slocObjOrType);
        return transformMeta ? transformMeta.transformer : this.defaultTransformer;
    }

}
