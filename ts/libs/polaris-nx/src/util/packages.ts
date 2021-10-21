import { GeneratorCallback, Tree, addDependenciesToPackageJson } from '@nrwl/devkit';

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages added by the generators.
 */
export const VERSIONS = {
    polaris: '0.2.0-beta.18',
    rxJs: '^6.6.7',
};

/** Full names of packages added by the generators. */
export const NPM_PACKAGES = {

    rxJs: 'rxjs',

    polaris: {
        core: `${POLARIS_NPM_ORG}/core`,
        commonMappings: `${POLARIS_NPM_ORG}/common-mappings`,

        orchestrators: {
            kubernetes: `${POLARIS_NPM_ORG}/kubernetes`,
        },

        queryBackends: {
            prometheus: `${POLARIS_NPM_ORG}/prometheus`,
        },
    },
};

/**
 * Adds the default Polaris dependencies to package.json, along with the specified extra dependencies.
 *
 * @param host The file system `Tree`.
 * @param extraDependencies Additional dependencies that should be added to package.json.
 * @param extraDevDependencies Additional devDependencies that should be added to package.json.
 */
export function addPolarisDependenciesToPackageJson(
    host: Tree,
    extraDependencies: Record<string, string> = {},
    extraDevDependencies: Record<string, string> = {},
): GeneratorCallback {
    const dependencies: Record<string, string> = {
        [NPM_PACKAGES.polaris.core]: VERSIONS.polaris,
        [NPM_PACKAGES.polaris.commonMappings]: VERSIONS.polaris,
        [NPM_PACKAGES.rxJs]: VERSIONS.rxJs,
        ...extraDependencies,
    };
    const devDependencies: Record<string, string> = {
        ...extraDevDependencies,
    };

    return addDependenciesToPackageJson(host, dependencies, devDependencies);
}
