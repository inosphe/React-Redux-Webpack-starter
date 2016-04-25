var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var __base = global.__base || __dirname;

module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	devtool: 'source-map',
	entry: [
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
		new webpack.optimize.OccurrenceOrderPlugin()
	    , new webpack.DefinePlugin({
	    	'process.env': {
	    		'NODE_ENV': JSON.stringify('production')
	    		, 'BABEL_ENV': JSON.stringify('production')
	    	}
	    })
	    , new webpack.optimize.UglifyJsPlugin({
	    	compressor: {
	    		warnings: false
	    	}
	    })
	    ,new ExtractTextPlugin("css/styles.css")
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
					
				}
			},
			// include: path.join(__base, 'src'),
			exclude: /node_modules/
		}
		, { test: /\.(png|jpg|gif|jpeg)$/, loader: 'url-loader?limit=8192'},
		, { test: /\.scss$/, loader: ExtractTextPlugin.extract('style-loader', 'css!sass') }
	]}
};
