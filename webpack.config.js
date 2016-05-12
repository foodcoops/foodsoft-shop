var webpack = require('webpack');
var pkg = require('./package.json');

module.exports = {
  entry: './src/index.jsx',
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel',
        exclude: /node_modules/,
        query: {
          plugins: ['transform-object-rest-spread'],
          presets: ['es2015', 'react']
        }
      }
    ],
  },
  output: {
    path: __dirname  + '/build',
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify(process.env.NODE_ENV),
        'VERSION': JSON.stringify(pkg.version),
      }
    })
  ]
};
