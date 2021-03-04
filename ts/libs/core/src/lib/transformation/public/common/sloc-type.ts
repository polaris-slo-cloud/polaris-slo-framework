import { Transform } from 'class-transformer';
import { SlocMetadataUtils, TypeFn } from '../../../util';
import { PropertyTransformer } from '../../internal/property-transformer';

/**
 * Property decorator to define the SLOC type of a property.
 *
 * @param typeFn A funciton that returns the constructor of the SLOC type.
 * @retuns A `PropertyDecorator` factory.
 */
// eslint-disable-next-line @typescript-eslint/naming-convention
export function SlocType(typeFn: TypeFn<any>): PropertyDecorator {
    return (prototype: any, propertyKey: string) => {
        const slocType = typeFn();
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        SlocMetadataUtils.setPropertySlocType(prototype.constructor, propertyKey, slocType);

        const propertyTransformer = new PropertyTransformer(slocType);
        const origDecorator = Transform(transformParams => propertyTransformer.transform(transformParams));
        origDecorator(prototype, propertyKey);
    };
}
