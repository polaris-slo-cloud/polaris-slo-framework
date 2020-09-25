module.exports = {
    name: 'cli-sloc-k8s-serializer',
    preset: '../../../jest.config.js',
    globals: {
        'ts-jest': {
            tsConfig: '<rootDir>/tsconfig.spec.json',
        }
    },
    transform: {
        '^.+\\.[tj]s$': 'ts-jest'
    },
    moduleFileExtensions: ['ts', 'js', 'html'],
    coverageDirectory: '../../../coverage/apps/cli/sloc-k8s-serializer'
};
