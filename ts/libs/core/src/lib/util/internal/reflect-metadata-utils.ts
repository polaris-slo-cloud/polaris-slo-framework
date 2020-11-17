import { SlocTransformationMetadata } from '../../transformation';
import { Constructor } from '../public/util-types';

/**
 * Defines the keys used store SLOC metadata using the Reflect API.
 */
const SLOC_METADATA_KEYS = {
/* eslint-disable @typescript-eslint/naming-convention */

    /** The key for storing `SlocTransformationMetadata`. */
    CLASS_TRANSFORMATION: 'sloc:transformation',

    /** The key for storing the Type of a property. */
    PROPERTY_TYPE: 'sloc:property-type:',

/* eslint-enable @typescript-eslint/naming-convention */
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
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        const ctor: Constructor<T> = target instanceof Function ? (target as any) : (target as any).constructor;
        const metadata: SlocTransformationMetadata<T> = Reflect.getMetadata(SLOC_METADATA_KEYS.CLASS_TRANSFORMATION, ctor);

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
        Reflect.defineMetadata(SLOC_METADATA_KEYS.CLASS_TRANSFORMATION, metadata, target);
    }

    /**
     * Gets the type that has been defined for the property `propertyKey` of the class `target` using
     * the `@SlocType` decorator.
     *
     * If no type has been defined for the `target` class, the prototype hierarchy is traversed upwards.
     *
     * @returns The type that has been defined for the specified property or `undefined` if this information is not available.
     */
    static getPropertySlocType<T>(target: Constructor<T>, propertyKey: keyof T & string): Constructor<any> {
        const metadataKey = this.getPropertyMetadataKey(propertyKey);
        return Reflect.getMetadata(metadataKey, target) as Constructor<any>;
    }

    /**
     * Sets the type that has been defined for the property `propertyKey` of the class `target` using
     * the `@SlocType` decorator.
     */
    static setPropertySlocType<T>(target: Constructor<T>, propertyKey: keyof T & string, propertyType: Constructor<any>): void {
        const metadataKey = this.getPropertyMetadataKey(propertyKey);
        Reflect.defineMetadata(metadataKey, propertyType, target);
    }

    private static getPropertyMetadataKey(propertyKey: string): string {
        return SLOC_METADATA_KEYS.PROPERTY_TYPE + propertyKey;
    }

}
