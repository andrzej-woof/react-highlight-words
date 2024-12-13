const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    './website/index.js'
  ],
  output: {
    path: '/build/static',
    filename: '[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './website/index.html'
    }),
    new CopyPlugin({
      patterns: [
        'src/main.d.ts'
      ]
    }),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
          exclude: path.join(__dirname, 'node_modules')
        },
        {
          test: /\.css$/,
          use: [
            {
              loader: "style-loader"
            },
            {
              loader: "css-loader",
              options: {
                modules: true
              }
            }
          ],
          exclude: path.join(__dirname, 'node_modules')
        }
     ]
  },
  devServer: {
    static: 'build',
    port: 3567
  }
}
