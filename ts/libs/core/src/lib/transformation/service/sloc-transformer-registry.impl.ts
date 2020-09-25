import { IndexByKey, SlocMetadataUtils } from '../../util';
import { NotSlocTransformableError } from '../sloc-transformable';
import { SlocTransformer } from '../sloc-transformer';
import { SlocTransformerRegistry } from './sloc-transformer-registry';

/**
 * Default implementation of the `SlocTransformerRegistry` interface.
 */
export class SlocTransformerRegistryImpl implements SlocTransformerRegistry {

    private registry: IndexByKey<SlocTransformer<any, any>> = {};

    registerTransformer(transformer: SlocTransformer<any, any>): void {
        this.registry[transformer.handledSlocTypeId] = transformer;
    }

    getTransformer<S>(slocObj: S): SlocTransformer<S, any> {
        const metadata = SlocMetadataUtils.getSlocTransformableMetadata(slocObj);
        if (metadata) {
            return this.registry[metadata.slocTypeId];
        } else {
            throw new NotSlocTransformableError(slocObj);
        }
    }

}
