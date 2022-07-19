import path from 'path';
import UglifyJsPlugin from 'uglifyjs-webpack-plugin';
import nodeExternals from 'webpack-node-externals';
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import webpack from 'webpack';
import { webpackConfig } from './webpack.config';

const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = () => {
    const config = webpackConfig();

    const optimizations = {
        minimizer: [new UglifyJsPlugin()],
    };

    return {
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css',
            }),
            new webpack.DefinePlugin({
                RUNTIME_ENV: JSON.stringify('server'),
            }),
        ],
        resolve: config.resolve,
        module: {
            rules: [
                config.modules.jsServer,
                config.modules.images,
                config.modules.fonts,
                config.modules.miniCss,
                config.modules.svg,
            ],
        },
        entry: {
            main: './server/index.ts',
        },
        output: {
            filename: '[name].js',
            path: path.resolve(process.cwd(), './build/server_build'),
        },
        performance: {
            hints: false,
        },
        optimization: optimizations,
        target: 'node',
        externals: [nodeExternals()],
    };
};