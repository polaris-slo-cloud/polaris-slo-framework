const { composePlugins, withNx } = require('@nx/webpack');
const path = require('path');

// Nx plugins for webpack.
module.exports = composePlugins(withNx(), config => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`

    // Workaround needed to fix SourceMaps for debugging.
    // See https://github.com/nrwl/nx/issues/15159
    config.output.devtoolModuleFilenameTemplate = function (info) {
        const rel = path.relative(process.cwd(), info.absoluteResourcePath);
        return `webpack:///./${rel}`;
    };
    return config;
});
