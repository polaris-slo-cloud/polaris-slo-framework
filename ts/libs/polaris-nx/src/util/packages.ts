import { GeneratorCallback, Tree, addDependenciesToPackageJson } from '@nrwl/devkit';

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages added by the generators.
 */
export const VERSIONS = {
    polaris: '0.2.0-beta.23',
    rxJs: '^6.6.7',
    tsNode: '^10.3.0',
    tsNodeConfigPaths: '^3.11.0',
};

/** Full names of packages added by the generators. */
export const NPM_PACKAGES = {

    rxJs: 'rxjs',
    tsNode: 'ts-node',
    tsNodeConfigPaths: 'tsconfig-paths',

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
        [NPM_PACKAGES.tsNode]: VERSIONS.tsNode,
        [NPM_PACKAGES.tsNodeConfigPaths]: VERSIONS.tsNodeConfigPaths,
        ...extraDevDependencies,
    };

    return addDependenciesToPackageJson(host, dependencies, devDependencies);
}
