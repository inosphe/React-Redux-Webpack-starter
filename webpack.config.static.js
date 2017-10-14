var path = require('path');
var webpack = require('webpack');
var __base = global.__base || __dirname;
var _ = require('lodash');


module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	devtool: 'source-map',
	entry: [
		'./src/frontend_embed/index.js'
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: ['node_modules', 'src/frontend', 'src/common', 'src']
	},
	output: {
		path: path.join(__base, 'dist'),
		filename: 'frontend_embed.js',
		publicPath: '/dist/'

	},
	plugins: [
	],
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: "babel-loader?cacheDirectory=true"
			}
		}]
	}
};
