/* eslint-disable */
export default {
    displayName: 'metrics-predicted-cost-efficiency-controller',
    preset: '../../../jest.preset.js',
    testEnvironment: 'node',
    transform: {
        '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../coverage/apps/metrics/predicted-cost-efficiency-controller',
};
