var extractTextPlugin = require('extract-text-webpack-plugin');
var webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: {
    map: './map/src/app.js',
    print: './print/src/app.js',
  },
  output: {
    path: path.resolve(__dirname, 'bin'),
    filename: '[name].js',
  },
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: extractTextPlugin.extract('css-loader'),
      },
      {
        test: /\.(png|gif|jpg|svg|eot|woff|ttf)/,
        loader: 'file-loader',
      },
    ]
  },
  plugins: [
    new extractTextPlugin('[name].css'),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     screw_ie8: true,
    //   },
    //   mangle: {
    //     screw_i8: true,
    //     keep_fnames: true,
    //   },
    // }),
  ]
}
