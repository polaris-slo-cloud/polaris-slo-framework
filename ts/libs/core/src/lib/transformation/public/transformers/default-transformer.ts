import { classToPlain, plainToClass } from 'class-transformer';
import { Constructor, InterfaceOf } from '../../../util';
import { PolarisTransformer } from '../common';
import { PolarisTransformationService } from '../service';

/**
 * This transformer does not alter the structure of the objects, it just performs a simple
 * `class instance` <--> `plain object` conversion.
 *
 * This transformer is used by default, if no specific tranformer has been registered for a type.
 */
export class DefaultTransformer<T> implements PolarisTransformer<T, InterfaceOf<T>> {

    transformToPolarisObject(slocType: Constructor<T>, orchPlainObj: InterfaceOf<T>, transformationService: PolarisTransformationService): T {
        return plainToClass(slocType, orchPlainObj);
    }

    transformToOrchestratorPlainObject(slocObj: T, transformationService: PolarisTransformationService): InterfaceOf<T> {
        return classToPlain(slocObj) as any;
    }

}
