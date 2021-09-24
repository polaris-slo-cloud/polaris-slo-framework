import { names } from '@nrwl/devkit';

/** The name of the function used to initialize a Polaris library. */
export const POLARIS_INIT_LIB_FN_NAME = 'initPolarisLib';

/** The name of the file that contains the function to initialize a Polaris library (.ts needs to be appended). */
 export const POLARIS_INIT_FN_FILE_NAME = 'init-polaris-lib'

const SLO_MAPPING_TYPE_SUFFIX = 'SloMapping';
const ELASTICITY_STRATEGY_TYPE_SUFFIX = 'ElasticityStrategy';
const COMPOSED_METRIC_TYPE_SUFFIX = 'Metric';

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
 * Represents a set of commonly used forms of an ElasticityStrategy name.
 */
export interface ElasticityStrategyNames {

    /**
     * @example 'Horizontal'
     */
    eStratName: string;

    /**
     * @example 'HorizontalElasticityStrategyController'
     */
    eStratControllerName: string;

    /**
     * @example 'horizontal-elasticity-strategy'
     */
    eStratFileName: string;

    /**
     * @example 'HorizontalElasticityStrategyConfig'
     */
    eStratConfigType: string;

    /**
     * @example 'HorizontalElasticityStrategy'
     */
    eStratType: string;

    /**
     * @example 'HorizontalElasticityStrategyKind'
     */
    eStratKind: string;

    /**
     * @example horizontalelasticitystrategies
     */
    eStratK8sResources: string;

}

/**
 * Represents a set of commonly used forms of a ComposedMetricType name.
 */
 export interface ComposedMetricTypeNames {

    /**
     * @example 'CostEfficiency'
     */
    compMetricValueType: string;

    /**
     * @example 'CostEfficiencyController'
     */
    compMetricControllerName: string;

    /**
     * @example 'cost-efficiency'
     */
    compMetricFileName: string;

    /**
     * @example 'CostEfficiencyParams'
     */
    compMetricParams: string;

    /**
     * @example 'CostEfficiencyMetric'
     */
    compMetricType: string;

    /**
     * Used for generating the `metricTypeName` property of the composed metric type.
     *
     * @example 'cost-efficiency'
     */
    compMetricUniqueTypeName: string;

    /**
     * @example 'CostEfficiencyMetricMapping'
     */
    compMetricMapping: string;

    /**
     * @example 'costefficiencymetricmappings'
     */
    compMetricK8sResources: string;

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
        sloMappingK8sResources: getPlural(sloMappingTypeName.toLowerCase()),
    };
}


/**
 * Generates various ElasticityStrategy-related names, based on the name of an ElasticityStrategy class.
 *
 * @param eStratTypeName The name of the SLO mapping class.
 */
export function getElasticityStrategyNames(eStratTypeName: string): ElasticityStrategyNames {
    let eStratName: string;
    if (eStratTypeName.endsWith(ELASTICITY_STRATEGY_TYPE_SUFFIX)) {
        eStratName = eStratTypeName.substring(0, eStratTypeName.length - ELASTICITY_STRATEGY_TYPE_SUFFIX.length);
    } else {
        eStratTypeName += ELASTICITY_STRATEGY_TYPE_SUFFIX;
    }

    return {
        eStratName,
        eStratControllerName: `${eStratTypeName}Controller`,
        eStratFileName: names(eStratTypeName).fileName,
        eStratConfigType: `${eStratTypeName}Config`,
        eStratType: eStratTypeName,
        eStratKind: `${eStratTypeName}Kind`,
        eStratK8sResources: getPlural(eStratTypeName.toLowerCase()),
    };
}

/**
 * Generates various ComposedMetricType-related names, based on the name of a ComposedMetric's value interface.
 *
 * @param compMetricValueType The name of the ComposedMetric's value interface.
 */
export function getComposedMetricTypeNames(compMetricValueType: string): ComposedMetricTypeNames {
    let compMetricBase: string;
    if (compMetricValueType.endsWith(COMPOSED_METRIC_TYPE_SUFFIX)) {
        compMetricBase = compMetricValueType.substring(0, compMetricValueType.length - COMPOSED_METRIC_TYPE_SUFFIX.length);
    } else {
        compMetricBase = compMetricValueType;
    }
    const compMetricMapping = `${compMetricBase}${COMPOSED_METRIC_TYPE_SUFFIX}Mapping`;
    const compMetricNames = names(compMetricBase);

    return {
        compMetricValueType: compMetricBase,
        compMetricControllerName: `${compMetricBase}Controller`,
        compMetricFileName: compMetricNames.fileName,
        compMetricParams: `${compMetricBase}Params`,
        compMetricType: `${compMetricBase}${COMPOSED_METRIC_TYPE_SUFFIX}`,
        compMetricMapping,
        compMetricK8sResources: getPlural(compMetricMapping.toLowerCase()),
        compMetricUniqueTypeName: compMetricNames.fileName,
    };
}

/**
 * @returns The plural form of the specified `singular`.
 */
export function getPlural(singular: string): string {
    if (singular.endsWith('y')) {
        return singular.substring(0, singular.length - 1) + 'ies';
    }
    return singular + 's';
}
