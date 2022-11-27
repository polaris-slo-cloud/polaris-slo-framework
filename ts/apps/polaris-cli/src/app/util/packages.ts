import { version as polarisVersion } from '../../../package.json';

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages that are currently used.
 */
export const VERSIONS = {
    nx: '14.4.2',
    polaris: polarisVersion,
};

/** Full names of packages. */
export const NPM_PACKAGES = {

    createNxWorkspace: 'create-nx-workspace',

    nrwl: {
        js: '@nrwl/js',
        node: '@nrwl/node',
    },

    polaris: {
        nx: `${POLARIS_NPM_ORG}/polaris-nx`,
        cli: `${POLARIS_NPM_ORG}/cli`,
    },
};

/** Full names of @polaris-sloc packages */
export const POLARIS_PKGS = [
    '@polaris-sloc/core',
    '@polaris-sloc/common-mappings',
    '@polaris-sloc/kubernetes',
    '@polaris-sloc/prometheus',
    '@polaris-sloc/cost-efficiency',
    '@polaris-sloc/schema-gen',
    '@polaris-sloc/polaris-nx',
    '@polaris-sloc/cli',
];
