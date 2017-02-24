/* eslint-disable */
require('es6-promise').polyfill();
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    'voz-living': './app/bootstrap.js',
    'background': './background/bootstrap.js',
    'options': './options/root.js',
  },
  output: {
    path: path.join(__dirname, './dist/chrome/'),
    filename: '[name].js'
  },
  module: {
    loaders: [
      {
        test: /\.css|\.less$/,
        loader: 'style-loader!css-loader!less-loader',
      },
      {
        test: /\.(eot|woff|woff2|ttf)(\?.*$|$)/,
        loader: 'base64-font-loader'
      },
      {
        test: /\.(svg|png|jpg)(\?.*$|$)/,
        loader: 'url-loader?limit=30000&name=./assert/[name].[ext]'
      },
      {
        test: /\.jsx$|\.js$|\.es6$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.html$/,
        loader: 'html'
      }
    ]
  },
  resolve: {
    root: [
      path.resolve('./app'),
      path.resolve('./node_modules')
    ],
    extensions: ['', '.js', '.json']
  },
  resolveLoader: {
    root: [
      path.join(__dirname, 'node_modules')
    ],
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(true),
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
    ]),
  ]
};
