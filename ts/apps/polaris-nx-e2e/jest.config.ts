/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-var-requires */

module.exports = {
    displayName: 'polaris-nx-e2e',
    preset: '../../jest.preset.js',
    globals: {
        'ts-jest': {
            tsconfig: '<rootDir>/tsconfig.spec.json',
        },
    },
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/polaris-nx-e2e',

    // Configure timeout for tests here, because of a bug in Jest v27 (https://github.com/facebook/jest/issues/11607)
    testTimeout: 300000,
};
