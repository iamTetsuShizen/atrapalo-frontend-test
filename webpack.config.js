const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/js/index.js'],
  output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'js/bundle.js'
  },
  devServer: {
    contentBase: './dist' //same as output path
  },
  plugins: [],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude : /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      }
    ]
  }
};