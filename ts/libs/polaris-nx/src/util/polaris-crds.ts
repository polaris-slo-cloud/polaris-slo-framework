
import * as path from 'path';
import {
    Tree,
    joinPathFragments,
    readJson,
    readProjectConfiguration,
    writeJson,
} from '@nrwl/devkit';
import { NormalizedLibraryClassGeneratorSchema } from './schema';
import { getWorkspaceTsConfigPath } from './ts-config';

const POLARIS_CRDS_FILE = './polaris-crds.json';

/** Describes a Polaris library, for which CRDs should be generated. */
export interface PolarisCrdLibrary {

    /** The path of the TS Config file relative to the root of the workspace. */
    tsConfig: string;

    /** Output directory for the CRDs relative to the root of the workspace. */
    outDir: string;

    /** TS entry point file for the library relative to the root of the workspace. */
    tsIndexFile: string;

    /** Import path (package name) of the library. */
    importPath: string;

    /** Class names of the Polaris types, for which CRDs should be generated. */
    polarisTypes: string[];

}

/** Describes all Polaris libraries, for which CRDs should be generated. */
export interface PolarisCrdLibraries {

    /** The libraries, for which CRDs should be generated. */
    libraries: PolarisCrdLibrary[];

}

/**
 * Registers the generated Polaris type for CRD generation.
 */
export function registerPolarisTypeAsCrd(host: Tree, options: NormalizedLibraryClassGeneratorSchema): void {
    const projectConfig = readProjectConfiguration(host, options.projectName);
    const packageJson: { name: string } = readJson(host, 'package.json');

    const crdLibs = readPolarisCrdLibrariesFile(host);
    addPolarisTypeToCrdLibrary(
        crdLibs,
        {
            tsConfig: path.posix.normalize(getWorkspaceTsConfigPath(host)),
            importPath: packageJson.name,
            outDir: path.posix.normalize(joinPathFragments(projectConfig.root, 'crds')),
            tsIndexFile: path.posix.normalize(joinPathFragments(projectConfig.sourceRoot, 'index.ts')),
        },
        options.className,
    );
    writePolarisCrdLibrariesFile(host, crdLibs);
}

/**
 * Reads the `PolarisCrdLibraries` from file or initializes an empty `PolarisCrdLibraries` object.
 */
export function readPolarisCrdLibrariesFile(host: Tree): PolarisCrdLibraries {
    let crdLibs: PolarisCrdLibraries;

    if (host.exists(POLARIS_CRDS_FILE)) {
        crdLibs = readJson(host, POLARIS_CRDS_FILE);
    } else {
        crdLibs = { libraries: [] };
    }

    return crdLibs;
}

/**
 * Writes the specified `PolarisCrdLibraries` to the respective file.
 */
export function writePolarisCrdLibrariesFile(host: Tree, crdLibs: PolarisCrdLibraries): void {
    writeJson(host, POLARIS_CRDS_FILE, crdLibs);
}

/**
 * Adds the specified `polarisType` to the specified `library` in `crdLibs`.
 *
 * If the library does not exist yet, it will be created.
 */
export function addPolarisTypeToCrdLibrary(crdLibs: PolarisCrdLibraries, library: Omit<PolarisCrdLibrary, 'polarisTypes'>, polarisType: string): void {
    const destLib = findOrCreateLibrary(crdLibs, library);
    if (!destLib.polarisTypes.find(item => item === polarisType)) {
        destLib.polarisTypes.push(polarisType);
    }
}

function findOrCreateLibrary(crdLibs: PolarisCrdLibraries, library: Omit<PolarisCrdLibrary, 'polarisTypes'>): PolarisCrdLibrary {
    if (!Array.isArray(crdLibs.libraries)) {
        crdLibs.libraries = [];
    }

    let destLib = crdLibs.libraries.find(item => item.importPath === library.importPath && item.tsIndexFile === library.tsIndexFile);
    if (!destLib) {
        destLib = {
            ...library,
            polarisTypes: [],
        };
        crdLibs.libraries.push(destLib);
    }

    return destLib;
}
