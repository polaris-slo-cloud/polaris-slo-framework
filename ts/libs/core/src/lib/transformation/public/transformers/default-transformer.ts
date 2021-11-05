import { classToPlain, plainToClass } from 'class-transformer';
import { cloneDeep } from 'lodash';
import { JsonSchema } from '../../../model';
import { Constructor, InterfaceOf } from '../../../util';
import { PolarisTransformer } from '../common';
import { PolarisTransformationService } from '../service';

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
     * Performs the transformation by iterating through all `properties` of `polarisSchema` and
     * - transforming the property's schema, if a PolarisType is registered for this property, or
     * - deep copying the property's schema otherwise.
     */
    transformToOrchestratorSchema(
        polarisSchema: JsonSchema<T>,
        polarisType: Constructor<T>,
        transformationService: PolarisTransformationService,
    ): JsonSchema<InterfaceOf<T>> {
        if (!polarisSchema || !polarisSchema.properties) {
            return polarisSchema;
        }
        const transformedSchema = this.cloneSchemaWithoutProperties(polarisSchema);
        const propKeys = Object.keys(polarisSchema.properties);

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

    private cloneSchemaWithoutProperties(polarisSchema: JsonSchema): JsonSchema {
        const { properties, ...srcSchema } = polarisSchema;
        const ret: JsonSchema = cloneDeep(srcSchema);
        ret.properties = properties ? {} : undefined;
        return ret;
    }

}
