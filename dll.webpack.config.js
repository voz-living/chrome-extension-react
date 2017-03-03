const webpack = require('webpack');
/* eslint-disable max-len */

const isProduction = typeof process.env.PRODUCTION !== 'undefined';
console.log((isProduction ? 'Production' : 'Test') + ' build ...');
const distPath = isProduction ? './dist/compiled/' : './dist/chrome/';

module.exports = {
  entry: {
    common: [
      'core-decorators',
      'lodash',
      'whatwg-fetch',
      'jquery',
      'cheerio',
      'socket.io-client', 'socket.io-p2p',
    ],
    content: [
      'react', 'react-dom', 'react-redux', 'redux', 'redux-logger', 'redux-promise', 'redux-thunk',
      'style-loader',
      'html2canvas',
      /*'jquery-inview',*/ 'mousetrap', 'tiny-cookie',
    ],
  },

  output: {
    filename: '[name].dll.js',
    path: distPath,
    library: '[name]_lib',
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
        beautify: false,
        comments: false,
    }),
    new webpack.DllPlugin({
      path: distPath + '[name]-manifest.json',
      name: '[name]_lib',
    }),
  ],
};
