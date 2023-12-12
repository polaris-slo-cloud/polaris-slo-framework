/** Describes the data stored in the polaris.json CLI config file. */
export interface PolarisCliConfigData {
    /** The version of the polaris.json schema. */
    version: 1;

    /** List of projects managed by the Polaris CLI. */
    projects: Record<string, PolarisCliProject>;
}

/** Stores details about a project created by the Polaris CLI. */
export interface PolarisCliProject {
    /** Defines the type of this PolarisCliProject. */
    projectType: PolarisCliProjectType;

    /** TS entry point file (index.ts for libs, main.ts for apps) for the project relative to the root of the workspace. */
    tsEntryPoint: string;

    /** Defines the Docker Image Name */
    dockerImageName?: string;

    /** Defines the Docker Image Tags */
    dockerImageTags?: string;

    /** Defines the Dockerfile Path */
    dockerFilePath?: string;
}

/** Stores details about a library project. */
export interface PolarisLibraryProject extends PolarisCliProject {
    projectType: PolarisCliProjectType.Library;

    /** Import path (package name) of this library. */
    importPath: string;

    /** Describes the CRDs that should be generated from this library. */
    crds?: PolarisCrdsConfig;
}

/** Stores details about a controller project. */
export interface PolarisControllerProject extends PolarisCliProject {
    projectType: PolarisControllerProjectType;
}

/** Describes the CRDs that should be generated from a {@link PolarisLibraryProject}. */
export interface PolarisCrdsConfig {
    /** The path of the TS Config file relative to the root of the workspace. */
    tsConfig: string;

    /** Output directory for the CRDs relative to the root of the workspace. */
    outDir: string;

    /** Class names of the Polaris types, for which CRDs should be generated. */
    polarisTypes: string[];
}

/** Defines the type of a particular {@link PolarisCliProject}. */
// eslint-disable-next-line no-shadow
export enum PolarisCliProjectType {
    Library = 'library',
    ComposedMetricController = 'composed-metric-controller',
    ElasticityStrategyController = 'elasticity-strategy-controller',
    SloController = 'slo-controller',
}

export type PolarisControllerProjectType =
    | PolarisCliProjectType.ComposedMetricController
    | PolarisCliProjectType.ElasticityStrategyController
    | PolarisCliProjectType.SloController;
