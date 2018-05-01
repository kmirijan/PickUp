// module.exports = {
// 	entry: './client.js',
// 	output: {
// 		filename: 'bundle.js',
// 		path: __dirname + '/public'
// 	},
// 	module: {
//         rules: [
//           {
//              test: /\.jsx?$/,
//              exclude: /node_modules/,
//              loader: 'babel-loader',
//              query: {
//                 presets: ['es2015', 'react']
//              }
//           }
//         ]
//    }
// }

const webpack = require('webpack');
module.exports = {
  entry: [
    './client.js'
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['babel-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/public',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './public'
  }

};
