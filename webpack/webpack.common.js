const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const configPath = '../config';
const paths = require(`${configPath}/paths`);
const getClientEnvironment = require(`${configPath}/env`);

const { appIndexJs, esLintFile, appBuild, publicUrlOrPath } = paths;

const env = getClientEnvironment(publicUrlOrPath);

module.exports = {
    entry: appIndexJs,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(js|jsx)$/,
                exclude: [/node_modules/],
                use: {
                    loader: 'babel-loader',
                },
            },
            {
                test: /\.svg$/,
                issuer: /\.[jt]sx?$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.html$/i,
                loader: 'html-loader',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/fonts/[hash][ext][query]',
                },
            },
            {
                test: /\.(png|jpg|jpeg)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/images/[hash][ext][query]',
                },
            },
            {
                test: /\.(gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/gifs/[hash][ext][query]',
                },
            },
        ],
    },
    resolve: {
        alias: {
            '@/static': path.resolve(__dirname, '../public/static'),
            '@': path.resolve(__dirname, '../src'),
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        new webpack.DefinePlugin(env.stringified),
        new WebpackManifestPlugin(),
        new LodashModuleReplacementPlugin(),
        new ESLintPlugin({
            files: esLintFile
        })
    ],
    output: {
        path: appBuild,
        globalObject: 'this',
    },
};