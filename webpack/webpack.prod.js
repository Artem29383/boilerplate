process.env.NODE_ENV = 'production';
const path = require('path');
const { merge } = require('webpack-merge');
const webpack = require('webpack');
const common = require('./webpack.common.js');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const ImageMinimizerPlugin = require("image-minimizer-webpack-plugin");
const paths = require('../config/paths');

const { appBuild, appPublic, appHtml } = paths;

const imageTypeIgnoreCopy = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];

module.exports = merge(common, {
  mode: 'production',
  devtool: false,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(appPublic, 'favicon.ico'),
          to: path.resolve(appBuild, 'favicon.ico'),
          toType: 'file',
        },
        {
          from: path.resolve(appPublic, 'static'),
          to: path.resolve(appBuild, 'static'),
          globOptions: {
            ignore: [
              ...imageTypeIgnoreCopy.map(ext => `**/images/*/*${ext}`),
              '**/fonts/**',
            ],
          },
          toType: 'dir',
        },
      ],
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: appHtml,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    new webpack.ProgressPlugin({
      modulesCount: 5000,
    }),
  ],
  output: {
    publicPath: '',
    pathinfo: true,
    filename: 'static/js/[name].[chunkhash].js',
    chunkFilename: 'static/js/[name].[chunkhash].chunk.js',
    clean: true,
  },
  optimization: {
    nodeEnv: 'production',
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: true,
          safari10: true,
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
      new ImageMinimizerPlugin({
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              "imagemin-gifsicle",
              "imagemin-mozjpeg",
              "imagemin-pngquant",
              "imagemin-svgo",
            ],
          },
        },
        loader: false,
      }),
    ],
  },
  performance: {
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
});
