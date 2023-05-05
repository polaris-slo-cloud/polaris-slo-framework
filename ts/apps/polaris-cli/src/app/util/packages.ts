import { version as polarisVersion } from '../../../package.json';

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages that are currently used.
 */
export const VERSIONS = {
    nx: '16.1.0',
    polaris: polarisVersion,
};

/** Full names of packages. */
export const NPM_PACKAGES = {
    createNxWorkspace: 'create-nx-workspace',

    nrwl: {
        js: '@nx/js',
        node: '@nx/node',
    },

    polaris: {
        nx: `${POLARIS_NPM_ORG}/polaris-nx`,
        cli: `${POLARIS_NPM_ORG}/cli`,
    },
};
