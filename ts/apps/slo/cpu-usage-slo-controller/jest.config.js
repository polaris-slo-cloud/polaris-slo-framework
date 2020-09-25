module.exports = {
    name: 'slo-cpu-usage-slo-controller',
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
    coverageDirectory: '../../../coverage/apps/slo/cpu-usage-slo-controller'
};
