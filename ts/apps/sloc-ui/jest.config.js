module.exports = {
    name: 'sloc-ui',
    preset: '../../jest.config.js',
    coverageDirectory: '../../coverage/apps/sloc-ui',
    snapshotSerializers: [
        'jest-preset-angular/build/AngularNoNgAttributesSnapshotSerializer.js',
        'jest-preset-angular/build/AngularSnapshotSerializer.js',
        'jest-preset-angular/build/HTMLCommentSerializer.js',
    ],
};
