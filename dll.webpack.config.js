const webpack = require('webpack');
/* eslint-disable max-len */
module.exports = {
  entry: {
    common: [
      'core-decorators',
      'lodash',
      'whatwg-fetch',
      'jquery-inview', 'mousetrap', 'tiny-cookie',
      'jquery',
      'cheerio',
      'react', 'react-dom', 'react-redux', 'redux', 'redux-logger', 'redux-promise', 'redux-thunk',
      'socket.io-client', 'socket.io-p2p',
      'style-loader',
    ],
  },

  output: {
    filename: '[name].dll.js',
    path: 'dist/chrome/',
    library: '[name]_lib',
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
    }),
    new webpack.DllPlugin({
      path: 'dist/chrome/[name]-manifest.json',
      name: '[name]_lib',
    }),
  ],
};
