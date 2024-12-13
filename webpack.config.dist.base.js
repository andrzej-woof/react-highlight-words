const CopyPlugin = require('copy-webpack-plugin')

const path = require('path')
const _ = require('lodash')
const pkg = require('./package.json')

module.exports = {
  devtool: 'source-map',
  entry: [
    './src/index.js'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    library: 'react-highlight-words'
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        'src/main.d.ts'
      ]
    })
  ],
  externals: _.chain({})
    .assign(
      pkg.dependencies,
      pkg.peerDependencies
    )
    .mapValues((value, key) => key)
    .value(),
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'babel-loader',
        exclude: /(node_modules)/,
        include: path.join(__dirname, 'src')
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
