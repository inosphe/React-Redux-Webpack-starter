var path = require('path');
var webpack = require('webpack');
var __base = global.__base || __dirname;
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var css_module = 

module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	devtool: 'source-map',
	entry: [
		// necessary for hot reloading with IE:
		'eventsource-polyfill',
		// listen to code updates emitted by hot middleware:
		'webpack-hot-middleware/client',
		// your code:
		'./src/frontend/core/index.jsx'
	],
	resolve: {
		extensions: ['', '.js', '.jsx'],
		modulesDirectories: ['node_modules', 'src/frontend']
	},
	output: {
		path: path.join(__base, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'

	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
		, new webpack.NoErrorsPlugin()
		, new ExtractTextPlugin("css/styles.css")
	],
	module: {
		loaders: [{
			test: /\.jsx?$/,
			// loaders: ['babel'],
			loader: 'babel',
			query: {
				"presets": ["react", "stage-0", "es2015"],
				"plugins": ["transform-decorators-legacy"],
				"env": {
					"development": {
						"presets": ["react-hmre"]
					}		
				}
			},
			// include: path.join(__base, 'src'),
			exclude: /node_modules/
		}
		, { test: /\.(png|jpg|gif|jpeg)$/, loader: 'url-loader?limit=8192'},
		, { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!sass') }
	]}
};
