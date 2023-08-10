const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TsConfigPathsPlugin = require('awesome-typescript-loader').TsConfigPathsPlugin
const CircularDependencyPlugin = require('circular-dependency-plugin')

module.exports = {
  plugins: [
    new HtmlWebpackPlugin(),
    new CircularDependencyPlugin({
      // exclude detection of files based on a RegExp
      exclude: /a\.js|node_modules/,
      // add errors to webpack instead of warnings
      failOnError: true,
      // allow import cycles that include an asyncronous import,
      // e.g. via import(/* webpackMode: "weak" */ './file.js')
      allowAsyncCycles: false,
      // set the current working directory for displaying module paths
      cwd: process.cwd(),
    }),
  ],
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
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.scss$/i,
        use: ['style-loader', 'css-loader', 'sass-loader'],
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
