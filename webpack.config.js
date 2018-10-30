const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './build');
const APP_DIR = path.resolve(__dirname, './client');

const config = {
  entry: {
    main: APP_DIR + '/index.js'
  },
  output: {
    filename: 'bundle.js',
    path: BUILD_DIR
  },
  module: {
    rules: [
      {
        test: /(\.css)$/,
        use: [
          {
            loader: 'css-loader'
          }
        ]
      },
      {
        test: /\.(jsx|js)?$/,
        use: [
          {
            loader: 'babel-loader',
            option: {
              cacheDirectory: true,
              presets: ['react', 'env']
            }
          }
        ]
      }
    ]
  }
};

module.exports = config;
