const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')

const resolvePath = _path => {
  return path.resolve(__dirname, _path)
}
const srcPath = resolvePath('./src')

module.exports = {
  mode: 'development',
  entry: './src/entry.tsx',
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      '@': srcPath,
    },
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.css$/,
        use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
      },
      {
        test: /\.[tj]sx?$/,
        include: srcPath,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
  plugins: [new HtmlWebpackPlugin()],
}
