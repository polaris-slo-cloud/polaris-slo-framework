module.exports = {
    preset: '../../../jest.preset.js',
    globals: {
        'ts-jest': { tsconfig: '<rootDir>/tsconfig.spec.json' },
    },
    transform: {
        '^.+\\.[tj]s$': 'ts-jest',
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../coverage/apps/cli/polaris-k8s-serializer',
    displayName: 'cli-polaris-k8s-serializer',
};
