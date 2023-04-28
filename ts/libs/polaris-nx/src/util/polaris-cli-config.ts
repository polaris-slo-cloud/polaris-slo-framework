import { Tree, joinPathFragments, readJson, readProjectConfiguration, writeJson } from '@nx/devkit';
import { PolarisCliError } from './errors';
import { joinPathFragmentsAndNormalize } from './fs';
import {
    PolarisCliConfigData,
    PolarisCliProject,
    PolarisCliProjectType,
    PolarisControllerProject,
    PolarisControllerProjectType,
    PolarisLibraryProject,
} from './polaris-cli-config-data';
import { getProjectSrcRoot } from './project-config';
import { NormalizedLibraryClassGeneratorSchema, NormalizedProjectGeneratorSchema } from './schema';
import { getWorkspaceTsConfigPath } from './ts-config';

const POLARIS_CLI_CONFIG_FILE = './polaris.json';

/**
 * Provides access to and manages the Polaris CLI configuration file.
 */
export class PolarisCliConfig {

    /**
     * The config data of this project.
     *
     * While this can be modified directly, it is recommended to use the methods provided by this class.
     */
    data: PolarisCliConfigData;

    protected constructor(data: PolarisCliConfigData, protected host: Tree) {
        this.data = data;
    }

    /**
     * Reads the `PolarisCliConfig` from file or initializes an empty `PolarisCliConfig` object.
     */
    static readFromFile(host: Tree): PolarisCliConfig {
        let data: PolarisCliConfigData;

        if (host.exists(POLARIS_CLI_CONFIG_FILE)) {
            data = readJson(host, POLARIS_CLI_CONFIG_FILE);
        } else {
            data = {
                version: 1,
                projects: {},
            };
        }

        return new PolarisCliConfig(data, host);
    }

    /** Writes the current state of the config to the respective config file. */
    writeToFile(): void {
        writeJson(this.host, POLARIS_CLI_CONFIG_FILE, this.data);
    }

    /**
     * Adds a new project to the config.
     */
    addProject(name: string, config: PolarisCliProject): PolarisCliProject {
        if (this.data.projects[name]) {
            throw new PolarisCliError(`The project ${name} already exists.`);
        }
        this.data.projects[name] = config;
        return config;
    }

    /**
     * @returns The {@link PolarisCliProject} with the specified `name`.
     */
    getProject(name: string): PolarisCliProject {
        return this.data.projects[name];
    }

    /**
     * Ensures that the project with the specified `name` exists and that it is of the expected `type`
     * and then returns it.
     */
    getAndValidateProject(name: string, type: PolarisCliProjectType.Library): PolarisLibraryProject;
    getAndValidateProject(name: string, type: PolarisControllerProjectType): PolarisControllerProject;
    getAndValidateProject(name: string, type: PolarisCliProjectType): PolarisCliProject {
        const project = this.getProject(name);
        if (!project) {
            throw new PolarisCliError(`Project ${name} does not exist in ${POLARIS_CLI_CONFIG_FILE}`);
        }
        if (project.projectType !== type) {
            throw new PolarisCliError(`Project ${name} is not of type ${type}, but is a ${project.projectType} instead.`, project);
        }
        return project;
    }

    /**
     * Gets the library project with the name `options.projectName` or creates it, if it does not exist.
     */
    getOrCreateLibraryProject(options: NormalizedLibraryClassGeneratorSchema): PolarisLibraryProject {
        let lib = this.getProject(options.projectName) as PolarisLibraryProject;

        if (lib) {
            if (lib.projectType !== PolarisCliProjectType.Library) {
                throw new PolarisCliError(`The project ${options.projectName} is not a library.`, lib);
            }
        } else {
            const projectConfig = readProjectConfiguration(this.host, options.projectName);
            const packageJson: { name: string } = readJson(this.host, joinPathFragments(projectConfig.root, 'package.json'));
            const srcRoot = getProjectSrcRoot(projectConfig);
            lib = {
                projectType: PolarisCliProjectType.Library,
                tsEntryPoint: joinPathFragmentsAndNormalize(srcRoot, 'index.ts'),
                importPath: packageJson.name,
            };
            this.data.projects[options.projectName] = lib;
        }

        return lib;
    }

    /**
     * Registers the generated Polaris type for CRD generation and adds a library project,
     * if it does not exist yet.
     */
    registerPolarisTypeAsCrd(options: NormalizedLibraryClassGeneratorSchema, polarisTypeName: string): void {
        const lib = this.getOrCreateLibraryProject(options);

        if (!lib.crds) {
            const projectConfig = readProjectConfiguration(this.host, options.projectName);
            lib.crds = {
                tsConfig: joinPathFragmentsAndNormalize(getWorkspaceTsConfigPath(this.host)),
                outDir: joinPathFragmentsAndNormalize(projectConfig.root, 'crds'),
                polarisTypes: [],
            };
        }

        if (!lib.crds.polarisTypes.find(item => item === polarisTypeName)) {
            lib.crds.polarisTypes.push(polarisTypeName);
        }
    }

    /**
     * Gets the controller project with the name `options.projectName` or creates it, if it does not exist.
     */
    getOrCreateControllerProject(options: NormalizedProjectGeneratorSchema, type: PolarisControllerProjectType): PolarisControllerProject {
        let controller = this.getProject(options.projectName) as PolarisControllerProject;

        if (controller) {
            if ((controller.projectType as any) === PolarisCliProjectType.Library) {
                throw new PolarisCliError(`The project ${options.projectName} is not a controller.`, controller);
            }
        } else {
            const projectConfig = readProjectConfiguration(this.host, options.projectName);
            const srcRoot = getProjectSrcRoot(projectConfig);
            controller = {
                projectType: type,
                tsEntryPoint: joinPathFragmentsAndNormalize(srcRoot, 'main.ts'),
            };
            this.data.projects[options.projectName] = controller;
        }

        return controller;
    }

}
