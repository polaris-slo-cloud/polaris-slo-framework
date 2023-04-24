/* eslint-disable */
export default {
    displayName: 'polaris-nx-e2e',
    preset: '../../jest.preset.js',
    transform: {
      '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../coverage/apps/polaris-nx-e2e',

    // Configure timeout for tests here, because of a bug in Jest v27 (https://github.com/facebook/jest/issues/11607)
    testTimeout: 300000,
};
