require('babel-polyfill');
require('babel-runtime/core-js/promise').default = require('bluebird');
require('./index');
