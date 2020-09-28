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
     * @note The `SlocTransformationMetada` of a parent class is only considered if its `inheritable` property has been set to `true`.
     *
     * @returns The `SlocTransformationMetadata` of the `target` object or `undefined` if `target` does not have this metadata.
     */
    static getSlocTransformationMetadata<T>(target: T | Constructor<T>): SlocTransformationMetadata<T> {
        const ctor: Constructor<T> = target instanceof Function ? (target as any) : (target as any).constructor;
        const metadata: SlocTransformationMetadata<T> = Reflect.getMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, ctor);

        if (metadata) {
            if (metadata.typeRegistered !== ctor && !metadata.inheritable) {
                return undefined;
            }
        }
        return metadata;
    }

    /**
     * Sets the specified `SlocTransformationMetadata` on the `target` object.
     */
    static setSlocTransformationMetadata<T>(metadata: SlocTransformationMetadata<T>, target: Constructor<T>): void {
        Reflect.defineMetadata(SLOC_METADATA_KEYS.TRANSFORMABLE, metadata, target);
    }

}
