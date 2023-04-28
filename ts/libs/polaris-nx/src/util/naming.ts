import { names } from '@nx/devkit';
import { POLARIS_API, getPlural as getPluralCore } from '@polaris-sloc/core';

/** The name of the function used to initialize a Polaris library. */
export const POLARIS_INIT_LIB_FN_NAME = 'initPolarisLib';

/** The name of the file that contains the function to initialize a Polaris library (.ts needs to be appended). */
export const POLARIS_INIT_FN_FILE_NAME = 'init-polaris-lib';

/**
 * The suffix of files containing a Polaris Resource Model type (.ts needs to be appended).
 *
 * A distinct suffix is needed to tell the metadata generation compiler plugin which files to process.
 */
export const MODEL_FILE_SUFFIX = '.prm';

/**
 * The directory (within the root of the workspace), in which SloMapping instances should be placed.
 */
export const SLO_MAPPINGS_DIR = 'slo-mappings';

const SLO_MAPPING_TYPE_FILE_SUFFIX = '.slo-mapping';
const SLO_CONTROLLER_FILE_SUFFIX = '.controller';
const ELASTICITY_STRATEGY_CONTROLLER_FILE_SUFFIX = '.controller';
const COMPOSED_METRIC_SOURCE_FILE_SUFFIX = '.metric-source';
const COMPOSED_METRIC_SOURCE_FACTORY_FILE_SUFFIX = COMPOSED_METRIC_SOURCE_FILE_SUFFIX + '.factory';

const SLO_MAPPING_TYPE_SUFFIX = 'SloMapping';
const ELASTICITY_STRATEGY_TYPE_SUFFIX = 'ElasticityStrategy';
const COMPOSED_METRIC_TYPE_SUFFIX = 'Metric';

/**
 * Represents a set of commonly used forms of the same name, as returned by the `name()` function of `@nx/devkit`.
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
     * @example 'cpu-usage.slo-mapping'
     */
    sloMappingFileName: string;

    /**
     * @example 'cpu-usage.slo'
     */
    sloMicrocontrollerFileName: string;

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
     * @example cpuusageslomappings
     */
    sloMappingK8sResources: string;

    /**
     * @example 'slo.polaris-slo-cloud.github.io'
     */
    sloMappingTypeApiGroup: string;
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
     * @example 'horizontal-elasticity-strategy.prm'
     */
    eStratFileName: string;

    /**
     * @example 'horizontal-elasticity-strategy.controller'
     */
    eStratControllerFileName: string;

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

    /**
     * @example 'elasticity.polaris-slo-cloud.github.io'
     */
    eStratTypeApiGroup: string;
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
     * @example 'cost-efficiency'
     */
    compMetricDirName: string;

    /**
     * @example 'cost-efficiency.prm'
     */
    compMetricFileName: string;

    /**
     * @example 'cost-efficiency.metric-source'
     */
    compMetricSourceFileName: string;

    /**
     * @example 'cost-efficiency.metric-source.factory'
     */
    compMetricSourceFactoryFileName: string;

    /**
     * @example 'CostEfficiencyParams'
     */
    compMetricParams: string;

    /**
     * @example 'CostEfficiencyMetric'
     */
    compMetricType: string;

    /**
     * @example 'CostEfficiencyMetricSource'
     */
    compMetricSource: string;

    /**
     * @example 'CostEfficiencyMetricSourceFactory'
     */
    compMetricSourceFactory: string;

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
        sloName = sloMappingTypeName;
        sloMappingTypeName += SLO_MAPPING_TYPE_SUFFIX;
    }
    const normalizedNames = names(sloName);

    return {
        sloName,
        sloMicrocontrollerName: `${sloName}Slo`,
        sloMappingFileName: normalizedNames.fileName + SLO_MAPPING_TYPE_FILE_SUFFIX + MODEL_FILE_SUFFIX,
        sloMicrocontrollerFileName: normalizedNames.fileName + SLO_CONTROLLER_FILE_SUFFIX,
        sloConfigType: `${sloName}SloConfig`,
        sloMappingType: sloMappingTypeName,
        sloMappingSpecType: `${sloMappingTypeName}Spec`,
        sloMappingK8sResources: getPlural(sloMappingTypeName.toLowerCase()),
        sloMappingTypeApiGroup: POLARIS_API.SLO_GROUP,
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
        eStratName = eStratTypeName;
        eStratTypeName += ELASTICITY_STRATEGY_TYPE_SUFFIX;
    }
    const normalizedNames = names(eStratTypeName);

    return {
        eStratName,
        eStratControllerName: `${eStratTypeName}Controller`,
        eStratFileName: normalizedNames.fileName + MODEL_FILE_SUFFIX,
        eStratControllerFileName: normalizedNames.fileName + ELASTICITY_STRATEGY_CONTROLLER_FILE_SUFFIX,
        eStratConfigType: `${eStratTypeName}Config`,
        eStratType: eStratTypeName,
        eStratKind: `${eStratTypeName}Kind`,
        eStratK8sResources: getPlural(eStratTypeName.toLowerCase()),
        eStratTypeApiGroup: POLARIS_API.ELASTICITY_GROUP,
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
    const compMetricType = `${compMetricBase}${COMPOSED_METRIC_TYPE_SUFFIX}`;
    const compMetricMapping = `${compMetricType}Mapping`;
    const normalizedNames = names(compMetricBase);
    const fileNameBase = normalizedNames.fileName;

    return {
        compMetricValueType: compMetricBase,
        compMetricDirName: fileNameBase,
        compMetricFileName: names(compMetricType).fileName + MODEL_FILE_SUFFIX,
        compMetricSourceFileName: fileNameBase + COMPOSED_METRIC_SOURCE_FILE_SUFFIX,
        compMetricSourceFactoryFileName: fileNameBase + COMPOSED_METRIC_SOURCE_FACTORY_FILE_SUFFIX,
        compMetricParams: `${compMetricBase}Params`,
        compMetricType,
        compMetricMapping,
        compMetricSource: `${compMetricType}Source`,
        compMetricSourceFactory: `${compMetricType}SourceFactory`,
        compMetricK8sResources: getPlural(compMetricMapping.toLowerCase()),
        compMetricUniqueTypeName: fileNameBase,
    };
}

/**
 * @returns The plural form of the specified `singular`.
 */
export function getPlural(singular: string): string {
    return getPluralCore(singular);
}
