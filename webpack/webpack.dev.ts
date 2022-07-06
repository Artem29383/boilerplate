process.env.NODE_ENV = 'development';
const common = require('./webpack.common');

import { merge } from 'webpack-merge';
import openBrowser from 'react-dev-utils/openBrowser';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import paths from '../config/paths';

const PORT = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

const { appHtml, appBuild, appIndexJs } = paths;

module.exports = merge(common, {
    entry: {
        app: appIndexJs,
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        client: {
            overlay: {
                warnings: false,
                errors: true,
            },
        },
        devMiddleware: {
            stats: {
                colors: true,
                hash: false,
                version: true,
                timings: true,
                assets: false,
                chunks: false,
                modules: false,
                publicPath: false,
            },
        },
        host,
        hot: true,
        port: PORT,
        historyApiFallback: true,
        onAfterSetupMiddleware: () => {
            openBrowser && openBrowser(`http://127.0.0.1:${PORT}/`);
        },
        onListening: function () {
            console.log('Listening on port:', PORT);
        },
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: appHtml,
        }),
    ],
    output: {
        path: appBuild,
        filename: 'static/js/bundle.js',
        chunkFilename: 'static/js/[name].chunk.js',
        publicPath: '/',
    },
});
