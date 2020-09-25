import { SlocTransformableMetadata } from '../../transformation';

/**
 * Defines the keys used store SLOC metadata using the Reflect API.
 */
const SLOC_METADATA_KEYS = {

    /** The key for storing `SlocTransformableMetadata`. */
    TRANSFORMABLE: 'sloc:transformable',

};

/**
 * Provides utility methods for manipulating SLOC metadata using the Reflect API.
 */
export class SlocMetadataUtils {

    /**
     * @returns The `SlocTransformableMetadata` of the `target` object or `undefined` if `target` does not have this metadata.
     */
    static getSlocTransformableMetadata(target: any): SlocTransformableMetadata {
        return Reflect.getMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, target);
    }

    /**
     * Sets the specified `SlocTransformableMetadata` on the `target` object.
     */
    static setSlocTransformableMetadata(metadata: SlocTransformableMetadata, target: any): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, metadata, target);
    }

}
