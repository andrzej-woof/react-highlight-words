const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const path = require('path')
const webpack = require('webpack')

module.exports = {
  devtool: 'eval',
  entry: [
    './website/index.js'
  ],
  output: {
    path: path.join(__dirname, 'build/static'),
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
        'src/main.d.ts',
        { from: path.join(__dirname, 'src/main.d.ts'), to: path.join(__dirname, 'build/static', 'main.d.ts') }
      ],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        // to temporarily suppress "ReactDOM.render is no longer supported in React 18" warnings
        // should be removed after switching to createRoot
        NODE_ENV: JSON.stringify('production')
      }
    })
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
            loader: 'style-loader'
          },
          {
            loader: 'css-loader',
            options: {
              modules: true
            }
          }
        ],
        exclude: path.join(__dirname, 'node_modules')
      }
    ]
  }
}
