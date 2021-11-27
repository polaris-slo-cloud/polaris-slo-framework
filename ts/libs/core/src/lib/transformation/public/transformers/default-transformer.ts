import { classToPlain, plainToClass } from 'class-transformer';
import { cloneDeep } from 'lodash';
import { JsonSchema } from '../../../model';
import { Constructor, InterfaceOf, cloneDeepWithoutExcluded } from '../../../util';
import { PolarisTransformationService, PolarisTransformer } from '../common';

/**
 * This transformer does not alter the structure of the objects, it just performs a simple
 * `class instance` <--> `plain object` conversion.
 *
 * This transformer is used by default, if no specific transformer has been registered for a type.
 */
export class DefaultTransformer<T> implements PolarisTransformer<T, InterfaceOf<T>> {

    transformToPolarisObject(polarisType: Constructor<T>, orchPlainObj: InterfaceOf<T>, transformationService: PolarisTransformationService): T {
        return plainToClass(polarisType, orchPlainObj);
    }

    transformToOrchestratorPlainObject(polarisObj: T, transformationService: PolarisTransformationService): InterfaceOf<T> {
        return classToPlain(polarisObj) as any;
    }

    /**
     * Performs the transformation by i) deep cloning `polarisSchema` without its properties and then,
     * ii) iterating over all `properties` of `polarisSchema` and
     * - invoking the {@link PolarisTransformationService} on the property if it has subproperties (i.e., it is an object) or
     * - deep copying the property's schema (i.e., a basic property of type string, number, etc.) otherwise.
     */
    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<T>,
        polarisType: Constructor<T>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<T> {
        if (!polarisSchema || !polarisSchema.properties) {
            return cloneDeep(polarisSchema);
        }
        const transformedSchema = this.cloneSchemaWithoutProperties(polarisSchema);
        const propKeys = Object.keys(polarisSchema.properties) as (keyof T)[];

        propKeys.forEach(propKey => {
            const propType = transformationService.getPropertyType(polarisType, propKey as any);
            const origPropSchema = polarisSchema.properties[propKey];
            if (propType && typeof origPropSchema === 'object') {
                transformedSchema.properties[propKey] = transformationService.transformToOrchestratorSchema(origPropSchema, propType);
            } else {
                transformedSchema.properties[propKey] = cloneDeep(origPropSchema);
            }
        });

        return transformedSchema;
    }

    private cloneSchemaWithoutProperties(polarisSchema: JsonSchema<T>): JsonSchema<T> {
        const ret: JsonSchema = cloneDeepWithoutExcluded(polarisSchema, 'properties');
        ret.properties = polarisSchema.properties ? {} : undefined;
        return ret;
    }

}
