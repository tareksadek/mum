const path = require('path');
const { InjectManifest } = require('workbox-webpack-plugin');

module.exports = {
    entry: './public/service-worker.ts',
    target: 'webworker',
    mode: 'production',
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'service-worker.js'
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [{
            test: /\.ts$/,
            use: [{
                loader: 'ts-loader',
                options: {
                  configFile: 'tsconfig.sw.json'
                }
            }],
            exclude: /node_modules/,
        }],
    },
    plugins: [
        new InjectManifest({
            swSrc: './public/service-worker.ts',
            swDest: 'service-worker.js',
            maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
        })
    ],
    optimization: {
        minimize: false,
    },
};
