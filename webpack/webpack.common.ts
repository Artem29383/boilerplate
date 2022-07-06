import path from 'path';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import InterpolateHtmlPlugin from 'react-dev-utils/InterpolateHtmlPlugin';
import LodashModuleReplacementPlugin from 'lodash-webpack-plugin';
import ESLintPlugin from 'eslint-webpack-plugin';

const configPath = '../config';
const paths = require(`${configPath}/paths`);
const getClientEnvironment = require(`${configPath}/env`);
import * as plugins from './plugins/define.plugin';
import WebpackPwaManifest from 'webpack-pwa-manifest';

const createStyledTransformer = require('typescript-plugin-styled-components').default;

const {esLintFile, appBuild, publicUrlOrPath} = paths;

const isDEV = process.env.NODE_ENV === 'development';

const env = getClientEnvironment(publicUrlOrPath);
module.exports = {
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
                test: /\.(?:ico|png|jpg|jpeg|ogg)$/i,
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
        new WebpackPwaManifest({
            fingerprints: false,
            inject: true,
            name: 'JPWA App',
            short_name: 'PWA',
            orientation: 'portrait',
            display: 'standalone',
            description: 'Best text editor for the real ones',
            background_color: '#1a4f79',
            theme_color: '#3a1a86',
            start_url: '.',
            icons: [
                {
                    src: path.resolve('./public/static/images/icon/webpack.png'),
                    sizes: [512],
                },
            ],
        }),
        new LodashModuleReplacementPlugin(),
        new ESLintPlugin({
            files: esLintFile
        }),
    ],
    output: {
        path: appBuild,
        globalObject: 'this',
        publicPath: '/',
        filename: isDEV ? '[name].js' : '[name].[chunkhash:8].js',
        chunkFilename: isDEV ? '[name].chunk.js' : '[name].[chunkhash:8].chunk.js',
        pathinfo: false,
    },
};