const webpack = require('webpack');
const path = require('path');

const BUILD_DIR = path.resolve(__dirname, './client/build');
const APP_DIR = path.resolve(__dirname, './client/src');

const config = {
  mode: 'development',
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
        exclude: /(node_modules)/,
        use: [
          {
            options: {
              cacheDirectory: true,
              presets: ['@babel/react', '@babel/env']
            },
            loader: 'babel-loader'
          }
        ]
      }
    ]
  }
};

module.exports = config;
