import { isEqual as _isEqual } from 'lodash';
import { ClassDecoratorFn, Constructor, SLOC_METADATA_KEYS } from '../util';

/**
 * Describes a SlocTransformable type.
 */
export interface SlocTransformableMetadata {

    /**
     * The unique ID of this SlocTransformable type.
     *
     * This is used to resolve a `SlocTransformer` for the type.
     */
    slocTypeId: string;

}

/**
 * Marks the decorated class as being transformable between an orchestrator-independent and an orchestrator-specific format.
 *
 * @param metadataOrSlocTypeId The metadata for configuring the transformation or the unique SlocTypeId of the decorated type.
 */
export function SlocTransformable(metadataOrSlocTypeId: SlocTransformableMetadata | string): ClassDecoratorFn {
    let metadata: SlocTransformableMetadata;
    if (typeof metadataOrSlocTypeId === 'string') {
        metadata = { slocTypeId: metadataOrSlocTypeId };
    } else {
        metadata = metadataOrSlocTypeId;
    }

    return (target: Constructor<any>) => {
        const existingMetada = Reflect.getMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, target);
        if (!_isEqual(metadata, existingMetada)) {
            Reflect.defineMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, metadata, target);
        }
    }
}
