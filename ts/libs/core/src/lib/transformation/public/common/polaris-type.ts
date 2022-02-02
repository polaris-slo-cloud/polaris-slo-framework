import { Transform } from 'class-transformer';
import { Constructor, TypeFn } from '../../../util';
import { PropertyTransformer } from '../../internal/property-transformer';
import { PolarisMetadataUtils } from '../../internal/reflect-metadata-utils';

/**
 * Property decorator to define the Polaris type of a property.
 *
 * This decorator must be applied to all properties of a model class that require a class to be instantiated
 * upon deserialization and/or that may need to be transformed before serialization/deserialization.
 *
 * To retrieve the configured type at runtime, use the `PolarisTransformationService.getPropertyType()` method.
 * Internally, `class-transformer` is used to drive the transformation.
 *
 * @param typeFn A function that returns the constructor of the Polaris type.
 * @returns A `PropertyDecorator` factory.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function PolarisType(typeFn: TypeFn<any>): PropertyDecorator {
    return (prototype: object, propertyKey: string) => {
        const polarisType = typeFn();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        PolarisMetadataUtils.setPropertyPolarisType(prototype.constructor as Constructor<any>, propertyKey, polarisType);

        const propertyTransformer = new PropertyTransformer(polarisType);
        const origDecorator = Transform(transformParams => propertyTransformer.transform(transformParams));
        origDecorator(prototype, propertyKey);
    };
}
