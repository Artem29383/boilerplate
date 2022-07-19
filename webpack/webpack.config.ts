const MiniCssExtractPlugin = require('mini-css-extract-plugin');

export const webpackConfig = () => {
    const modules = {
        images: {
            test: /\.(png|jpg|jpeg|gif)$/,
            use: {
                loader: 'file-loader',
                options: {
                    name: 'static/[name].[hash].[ext]',
                },
            },
        },
        miniCss: {
            test: /\.css$/i,
            use: [
                {
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: 'css-loader',
                },
            ],
        },
        svg: {
            test: /\.svg$/,
            oneOf: [
                {
                    use: ['@svgr/webpack'],
                },
            ],
        },
        css: {
            test: /\.css$/i,
            use: [
                {
                    loader: 'style-loader',
                },
                {
                    loader: 'css-loader',
                },
            ],
        },
        fonts: {
            test: /\.(otf|ttf|woff|woff2|eot)$/,
            use: ['file-loader'],
        },
        jsClient: {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: [
                {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            '@babel/preset-react',
                            '@babel/preset-typescript',
                        ],
                    },
                },
                'eslint-loader',
                'stylelint-custom-processor-loader',
                'source-map-loader',
            ],
        },
        jsServer: {
            test: /\.ts(x?)$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: [
                        '@babel/preset-env',
                        '@babel/preset-react',
                        '@babel/preset-typescript',
                    ],
                },
            },
        },
    };

    // if (env === 'production') {
    // }
    //
    const resolve = {
        modules: ['src', 'node_modules'],
        descriptionFiles: ['package.json'],
        extensions: ['.ts', '.tsx', '.js', '.json', '.jsx'],
    };

    return {
        modules,
        resolve,
    };
}