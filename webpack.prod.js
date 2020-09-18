/* eslint-env node */
const webpack = require('webpack')
const { merge } = require('webpack-merge')

const baseWebpackConfig = require('./webpack.config')
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')

const baseConfig = baseWebpackConfig
const publicPath = '/'
const filename = `static/js/[name].[chunkhash:8].js`
const config = merge(baseConfig, {
  mode: 'production',
  devtool: 'source-map',
  output: {
    crossOriginLoading: 'anonymous',
    publicPath,
    filename,
    chunkFilename: filename,
  },
  optimization: {
    minimizer: [new TerserPlugin()],
    moduleIds: 'hashed',
    chunkIds: 'named',
    splitChunks: {
      name: false,
      maxAsyncRequests: Infinity,
      maxInitialRequests: Infinity,
      minSize: 10000,
      cacheGroups: {
        /**
         * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
         * 把所有css打包到一个文件是一个好做法吗？
         * Cons: 对性能有影响
         * Pros: 可以解决低端浏览器不支持link onload事件，导致异步加载一直pendding的问题
         * https://github.com/webpack-contrib/mini-css-extract-plugin/issues/294
         */
        styles: {
          name: 'styles',
          test: (module) =>
            module.nameForCondition &&
            /\.(css|less)$/.test(module.nameForCondition()) &&
            !/^javascript/.test(module.type),
          chunks: 'all',
          enforce: true,
        },
        vendors: {
          name: 'vendors',
          test: (module) =>
            module.resource &&
            /\.js$/.test(module.resource) &&
            /node_modules/.test(module.resource),
          chunks: 'initial',
        },
      },
    },
    runtimeChunk: { name: 'runtime' },
  },
  plugins: [
    new ScriptExtHtmlWebpackPlugin({
      inline: [
        // https://github.com/webpack-contrib/mini-css-extract-plugin/issues/85
        /styles.*\.js$/, // temporary fix style.js issue
      ],
      // 记录加载失败的资源
      custom: [
        {
          test: /\.js$/,
          attribute: 'crossorigin',
        },
      ],
    }),

    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].[contenthash:8].css',
    }),
  ],
})

module.exports = config
