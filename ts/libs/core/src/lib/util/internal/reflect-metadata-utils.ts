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
     * Gets the `SlocTransformationMetadata` that has been applied to the constructor of the type `T`.
     *
     * This intentionally does not traverse the prototype chain of `T`, because we assume that a subclass needs to
     * be transformed differently than its parent class.
     *
     * If the same transformer should be used for the parent- and the subclass, it needs to be registered for both of them.
     *
     * @returns The `SlocTransformationMetadata` of the `target` object or `undefined` if `target` does not have this metadata.
     */
    static getSlocTransformationMetadata<T>(target: T | Constructor<T>): SlocTransformationMetadata<T> {
        const ctor: Constructor<T> = target instanceof Function ? (target as any) : (target as any).constructor;
        return Reflect.getOwnMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, ctor);
    }

    /**
     * Sets the specified `SlocTransformationMetadata` on the `target` object.
     */
    static setSlocTransformationMetadata<T>(metadata: SlocTransformationMetadata<T>, target: Constructor<T>): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, metadata, target);
    }

}
