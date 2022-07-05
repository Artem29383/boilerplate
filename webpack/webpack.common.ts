import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import {WebpackManifestPlugin} from 'webpack-manifest-plugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const configPath = '../config';
const paths = require(`${configPath}/paths`);
const getClientEnvironment = require(`${configPath}/env`);
import * as plugins from './plugins/define.plugin';

const createStyledTransformer = require('typescript-plugin-styled-components').default;

const {appIndexJs, esLintFile, appBuild, publicUrlOrPath} = paths;

const isDEV = process.env.NODE_ENV === 'development';

const env = getClientEnvironment(publicUrlOrPath);
module.exports = {
    entry: appIndexJs,
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                options: {
                    getCustomTransformers: () => ({
                        before: [
                            createStyledTransformer({
                                ssr: false,
                                displayName: isDEV,
                                getDisplayName(filename: string) {
                                    return path.resolve(filename.replace(/^.+\/boilerplate/, '/boilerplate'));
                                },
                            }),
                        ]})
                },
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
            '@server': path.resolve(__dirname, '../server')
        },
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: [
        new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
        plugins.definePlugin({
            env: env.stringified,
            spa: isDEV,
            server: !isDEV
        }),
        new WebpackManifestPlugin({}),
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