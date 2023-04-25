/* eslint-disable */
export default {
    displayName: 'metrics-rest-api-cost-efficiency-controller',
    preset: '../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../coverage/apps/metrics/rest-api-cost-efficiency-controller',
};
