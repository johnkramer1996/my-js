const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin

module.exports = {
  plugins: [new HtmlWebpackPlugin()],
  mode: 'development',
  devtool: 'inline-source-map',
  entry: './src/index.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'build.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.my-js/,
        type: 'asset/source',
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    plugins: [new TsConfigPathsPlugin()],
  },
  devServer: {
    open: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
    compress: true,
    port: 8086,
  },
}
