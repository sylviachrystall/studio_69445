'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const inDevelopment = require('./scripts/webpack-modeful').inDevelopment
const inProduction = require('./scripts/webpack-modeful').inProduction
const whenDevelopment = require('./scripts/webpack-modeful').whenDevelopment
const whenProduction = require('./scripts/webpack-modeful').whenProduction
const getVersion = require('./scripts/getVersion')

const version = inProduction ? getVersion() : require('./package.json').version

module.exports = {
  entry: './src/scripts/index.js',

  output: {
    path: path.join(__dirname, inDevelopment ? '/dev' : '/dist'),
    publicPath: '/',
    filename: 'scripts.js'
  },

  devtool: inDevelopment ? 'inline-source-map' : false,

  module: {
    rules: [
      // Markup processing
      { test: /\.hbs$/,
        loader: 'handlebars-loader',
        query: {
          helperDirs: [ path.join(__dirname, '/src/markup/helpers') ],
          partialDirs: [ path.join(__dirname, '/src/markup/partials') ]
        }
      },
      // Style processing
      { test: /\.(sass|scss|css)$/,
        use: [
          { loader: 'css-loader',
            options: {
              url: false,
              sourceMap: inDevelopment
            }
          },
          { loader: 'postcss-loader',
            options: {
              sourceMap: inDevelopment,
              ident: 'postcss',
              plugins: [ require('autoprefixer') ]
            }
          },
          { loader: 'sass-loader',
            options: {
              sourceMap: inDevelopment
            }
          }
        ]
      },
      // JavaScript processing
      { test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(version)
    }),
    ...whenDevelopment(
      new CopyWebpackPlugin([
        // copy jquery
        { from: path.join(__dirname, '/node_modules/jquery/dist/jquery.min.js'),
          to: path.join(__dirname, '/dev') },
        // copy index.html
        { from: path.join(__dirname, '/src/markup/index.html'),
          to: path.join(__dirname, '/dev') }
      ])
    ),
    ...whenProduction(
      new webpack.BannerPlugin({ banner: `EPLA (c) 2015-2019 Sylvia Chrystall v${version}` })
    )
  ],

  devServer: {
    contentBase: path.join(__dirname, '/dev'),
    writeToDisk: true,
    compress: true
  }
}
