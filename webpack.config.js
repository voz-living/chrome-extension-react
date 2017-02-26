/* eslint-disable */
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
    rules: [
      {
        test: /\.css|\.less$/,
        use: [
          { loader: 'style-loader'},
          { loader: 'css-loader'},
          { loader: 'less-loader'},
        ],
      },
      {
        test: /\.(eot|woff|woff2|ttf)(\?.*$|$)/,
        use: [
          { loader: 'base64-font-loader' },
        ],
      },
      {
        test: /\.(svg|png|jpg)(\?.*$|$)/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 30000,
              name: './assert/[name].[ext]',
            },
          },
        ],
      },
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
