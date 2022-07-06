process.env.NODE_ENV = 'production';
import path from 'path';
import { merge } from 'webpack-merge';
import webpack from 'webpack';
const common = require('./webpack.common.ts');
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import ImageMinimizerPlugin from "image-minimizer-webpack-plugin";
import paths from '../config/paths';

const { appBuild, appPublic, appHtml, appIndexJs } = paths;

const imageTypeIgnoreCopy = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];

module.exports = merge(common, {
  entry: {
    app: appIndexJs,
    sw: './public/sw.js'
  },
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
