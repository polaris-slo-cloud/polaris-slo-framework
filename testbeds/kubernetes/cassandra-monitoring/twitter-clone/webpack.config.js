const path = require('path');

module.exports = {
    entry: './src/main.ts',
    target: 'node',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        filename: 'tweeter.js',
        path: path.resolve(__dirname, 'dist/build'),
    },
};
