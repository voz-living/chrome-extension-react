/* eslint-disable */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const isProduction = typeof process.env.PRODUCTION !== 'undefined';
console.log((isProduction ? 'Production' : 'Test') + ' build ...');
const distPath = isProduction ? './dist/compiled/' : './dist/chrome/';
module.exports = {
  devtool: isProduction ? 'nosources-source-map' : 'cheap-module-source-map',
  entry: {
    'voz-living': './app/bootstrap.js',
    'background': './background/bootstrap.js',
    'options': './options/root.js',
  },
  output: {
    path: path.join(__dirname, distPath),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.jsx$|\.js$/,
        exclude: /node_modules/,
        use: [
          { loader: 'babel-loader' }
        ],
      },
    ]
  },
  resolve: {
    modules: [
      path.resolve('./app'),
      path.resolve('./node_modules')
    ],
    extensions: ['.js', '.json']
  },
  plugins: [
    new webpack.DllReferencePlugin({
      context: '.',
      manifest: require(distPath + 'common-manifest.json')
    }),
    new CopyWebpackPlugin([
      {
        from: path.join(__dirname, './manifest.json'),
        to: 'manifest.json'
      },
      {
        from: path.join(__dirname, './assert'),
        to: './assert'
      },
      {
        from: path.join(__dirname, './options/options.html'),
        to: './options.html'
      },
      {
        from: path.join(__dirname, './background/background.html'),
        to: './background.html'
      },
    ]),
  ].concat(isProduction ? [
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
    }),
  ]: [])
};
