import { SlocTransformationMetadata } from '../../transformation';
import { Constructor } from '../public/util-types';

/**
 * Defines the keys used store SLOC metadata using the Reflect API.
 */
const SLOC_METADATA_KEYS = {

    /** The key for storing `SlocTransformationMetadata`. */
    TRANSFORMABLE: 'sloc:transformation',

};

/**
 * Provides utility methods for manipulating SLOC metadata using the Reflect API.
 */
export class SlocMetadataUtils {

    /**
     * @returns The `SlocTransformationMetadata` of the `target` object or `undefined` if `target` does not have this metadata.
     */
    static getSlocTransformationMetadata<T>(target: T | Constructor<T>): SlocTransformationMetadata<T> {
        return Reflect.getMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, target);
    }

    /**
     * Sets the specified `SlocTransformationMetadata` on the `target` object.
     */
    static setSlocTransformationMetadata<T>(metadata: SlocTransformationMetadata<T>, target: Constructor<T>): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, metadata, target);
    }

}
