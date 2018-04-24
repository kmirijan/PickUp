const path = require('path'),
	HtmlPlugin = require('html-webpack-plugin');


module.exports = 
{
	entry: path.join(path.resolve(__dirname, 'src\\games.js')),
	output:
	{
		path: path.resolve(__dirname, 'build'),
		filename: 'games.build.js',
	},


	module: 
	{
		rules:
		[
			{
				test: /\.(js|jsx)$/,
				exclude: /node_modules/,
				use: 
				[
					'babel-loader'
				],
			},
		],

	},

	resolve: 
	{
		extensions: ['.js', '.jsx'],
	},

	plugins:
	[
		new HtmlPlugin({ template:'src/home.html'}),
	],
};
