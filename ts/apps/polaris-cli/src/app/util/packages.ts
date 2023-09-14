import { version as polarisVersion } from '../../../package.json';

/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages that are currently used.
 */
export const VERSIONS = {
    nx: '16.7.4',
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
        core: `${POLARIS_NPM_ORG}/core`,
        commonMappings: `${POLARIS_NPM_ORG}/common-mappings`,
        kubernetes: `${POLARIS_NPM_ORG}/kubernetes`,
        prometheus: `${POLARIS_NPM_ORG}/prometheus`,
        costEfficiency: `${POLARIS_NPM_ORG}/cost-efficiency`,
        schemaGen: `${POLARIS_NPM_ORG}/schema-gen`,
        nx: `${POLARIS_NPM_ORG}/polaris-nx`,
        cli: `${POLARIS_NPM_ORG}/cli`,
    },
};

/** Full names of @polaris-sloc packages */
export const POLARIS_PKGS = Object.values(NPM_PACKAGES.polaris);
