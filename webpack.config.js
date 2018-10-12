var webpack = require('webpack');
var I18nPlugin = require('webpack-rails-i18n-js-plugin');
var pkg = require('./package.json');
var config = require('./src/config');

module.exports = {
  entry: './src/index.jsx',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-object-rest-spread', 'transform-runtime'],
          presets: ['env', 'react']
        }
      },
      {test: /\.(png|jpg|svg)$/, loader: 'url-loader', options: { limit: 8192 }},
      {test: /\.(css)$/, loader: 'simple-css-loader'},
      {test: /\/countries_data\.js$/, loader: 'val-loader' },
    ],
  },
  output: {
    path: __dirname  + '/build',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'APP_VERSION': JSON.stringify(pkg.version),
        'APP_NAME': JSON.stringify(pkg.name),
      }
    }),
    new I18nPlugin({
      localesPath: `${__dirname}/locales`
    }),
    // save space by removing locales that Foodsoft doesn't support anyway - http://stackoverflow.com/a/25426019/2866660
    new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, new RegExp('/(' + config.locales.join('|') + ')\\./')),
  ]
};
