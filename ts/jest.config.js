const { getJestProjects } = require('@nrwl/jest');

module.exports = {
    projects: [
        ...getJestProjects(),
        '<rootDir>/libs/kubernetes',
        '<rootDir>/apps/polaris-nx-e2e',
    ]
};
