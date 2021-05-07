
/** The name of the Polaris npm organization. */
export const POLARIS_NPM_ORG = '@polaris-sloc';

/**
 * Defines the versions of packages added by the generators.
 */
export const VERSIONS = {
    polaris: '^0.2.0',
};

/** Full names of packages added by the generators. */
export const NPM_PACKAGES = {

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
