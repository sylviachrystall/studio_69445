'use strict'

const path = require('path')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const inDevelopment = require('./webpack-modeful').inDevelopment
const inProduction = require('./webpack-modeful').inProduction
const whenDevelopment = require('./webpack-modeful').whenDevelopment
const whenProduction = require('./webpack-modeful').whenProduction
const getVersion = require('./getVersion')

const VERSION = inProduction ? getVersion() : getVersion.packageVersion
const ROOT = path.join(__dirname, '../')

module.exports = {
  entry: './src/scripts/index.js',

  output: {
    path: path.join(ROOT, inDevelopment ? '/dev' : '/dist'),
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
          helperDirs: [ path.join(ROOT, '/src/markup/helpers') ],
          partialDirs: [ path.join(ROOT, '/src/markup/partials') ]
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
      __VERSION__: JSON.stringify(VERSION)
    }),
    ...whenDevelopment(
      new CopyWebpackPlugin([
        // copy jquery
        { from: path.join(ROOT, '/node_modules/jquery/dist/jquery.min.js'),
          to: path.join(ROOT, '/dev') },
        // copy index.html
        { from: path.join(ROOT, '/src/markup/index.html'),
          to: path.join(ROOT, '/dev') }
      ])
    ),
    ...whenProduction(
      new webpack.BannerPlugin({ banner: `EPLA (c) 2015-2019 Sylvia Chrystall v${VERSION}` })
    )
  ],

  devServer: {
    contentBase: path.join(ROOT, '/dev'),
    writeToDisk: true,
    compress: true
  }
}
