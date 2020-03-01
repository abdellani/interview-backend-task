const path = require('path');
const nodeExternals = require('webpack-node-externals');
const NodemonPlugin = require('nodemon-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  mode: 'development',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'index.js',
  },
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [],
  },
  plugins: [
    new NodemonPlugin({
      watch: path.resolve('dist'),
      script: 'dist',
    }),
  ],
};
