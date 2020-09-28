import { Transform } from 'class-transformer';
import { TypeFn } from '../../../util';
import { PropertyTransformer } from '../../internal';

export function SlocType(typeFn: TypeFn<any>): PropertyDecorator {
    return (prototype: any, propertyKey: string) => {
        const slocType = typeFn();
        const propertyTransformer = new PropertyTransformer(slocType);
        const origDecorator = Transform((value, obj, transformationType) => propertyTransformer.transform(value, obj, transformationType));
        origDecorator(prototype, propertyKey);
    };
}
