import { names } from '@nrwl/devkit';

const SLO_MAPPING_TYPE_SUFFIX = 'SloMapping';

/**
 * Represents a set of commonly used forms of the same name, as returned by the `name()` function of `@nrwl/devkit`.
 */
export interface NormalizedNames {

    /**
     * The name given as input.
     */
    name: string;

    /**
     * @example 'MyName'
     */
    className: string;

    /**
     * @example 'myName'
     */
    propertyName: string;

    /**
     * @example 'MY_NAME'
     */
    constantName: string;

    /**
     * @example 'my-name'
     */
    fileName: string;
}

/**
 * Represents a set of commonly used forms of an SLO name.
 */
export interface SloNames {

    /**
     * @example 'CpuUsage'
     */
    sloName: string;

    /**
     * @example 'CpuUsageSlo'
     */
    sloMicrocontrollerName: string;

    /**
     * @example 'cpu-usage'
     */
    sloFileName: string;

    /**
     * @example 'CpuUsageSloConfig'
     */
    sloConfigType: string;

    /**
     * @example 'CpuUsageSloMapping'
     */
    sloMappingType: string;

    /**
     * @example 'CpuUsageSloMappingSpec'
     */
     sloMappingSpecType: string;

    /**
     * @example costefficiencyslomappings
     */
    sloMappingK8sResources: string;

}

/**
 * Generates various SLO-related names, based on the name of an SLO mapping class.
 *
 * @param sloMappingTypeName The name of the SLO mapping class.
 */
export function getSloNames(sloMappingTypeName: string): SloNames {
    let sloName: string;
    if (sloMappingTypeName.endsWith(SLO_MAPPING_TYPE_SUFFIX)) {
        sloName = sloMappingTypeName.substring(0, sloMappingTypeName.length - SLO_MAPPING_TYPE_SUFFIX.length);
    } else {
        sloMappingTypeName += SLO_MAPPING_TYPE_SUFFIX;
    }

    return {
        sloName,
        sloMicrocontrollerName: `${sloName}Slo`,
        sloFileName: names(sloName).fileName,
        sloConfigType: `${sloName}SloConfig`,
        sloMappingType: sloMappingTypeName,
        sloMappingSpecType: `${sloMappingTypeName}Spec`,
        sloMappingK8sResources: `${sloMappingTypeName.toLowerCase()}s`,
    };
}
