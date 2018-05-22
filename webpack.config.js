
/*https://github.com/alanbsmith/react-node-example*/
const webpack = require('webpack');
module.exports = {
  mode:'none',
  entry: [
    './src/index.js'
  ],
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ['cache-loader', 'babel-loader']
      },
      {
        test:/\.css$/,
        use:['style-loader','css-loader']
      },
      {
        test:/\.(jpg|png|gif)$/,
        use:['url-loader']
      }
    ]
  },
  resolve: {
    extensions: ['*', '.js', '.jsx']
  },
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  devServer: {
    contentBase: './dist',
    historyApiFallback: true
  },
  plugins:[
    new webpack.HotModuleReplacementPlugin()
  ]

};
