const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    'babel/polyfill',
    './website/index.js'
  ],
  output: {
    path: 'build',
    filename: '/static/[name].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      inject: true,
      template: './website/index.html'
    }),
    new CopyPlugin(
      [
        'src/main.d.ts'
      ],
    ),
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // to temporarily suppress "ReactDOM.render is no longer supported in React 18" warnings
        // should be removed after switching to createRoot
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel',
        exclude: path.join(__dirname, 'node_modules')
      },
      {
        test: /\.css$/,
        loaders: ['style', 'css?modules&importLoaders=1', 'cssnext'],
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  }
}
