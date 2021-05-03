
module.exports = {
    "extends": "../../../.eslintrc.js",
    "overrides": [
        {
            "files": ["*.ts"],
            "rules": {
                '@angular-eslint/directive-selector': [
                    'error',
                    { type: 'attribute', prefix: 'polaris', style: 'camelCase' },
                ],

                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'polaris', style: 'kebab-case' },
                ],
            }
        }
    ]
};
