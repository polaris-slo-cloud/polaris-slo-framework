import { Transform } from 'class-transformer';
import { SlocMetadataUtils, TypeFn } from '../../../util';
import { PropertyTransformer } from '../../internal/property-transformer';

export function SlocType(typeFn: TypeFn<any>): PropertyDecorator {
    return (prototype: any, propertyKey: string) => {
        const slocType = typeFn();
        SlocMetadataUtils.setPropertySlocType(prototype.constructor, propertyKey, slocType);

        const propertyTransformer = new PropertyTransformer(slocType);
        const origDecorator = Transform((value, obj, transformationType) => propertyTransformer.transform(value, obj, transformationType));
        origDecorator(prototype, propertyKey);
    };
}
