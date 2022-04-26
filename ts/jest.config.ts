/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

const { getJestProjects } = require('@nrwl/jest');

module.exports = {
    projects: [
        ...getJestProjects(),
        '<rootDir>/libs/kubernetes',
        '<rootDir>/apps/polaris-nx-e2e',
    ],
};
