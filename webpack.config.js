var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var __base = global.__base || __dirname;

var process = require('process');
console.log(process.env.NODE_ENV)

module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	devtool: 'source-map',
	entry: [
    	'babel-polyfill',
		'eventsource-polyfill',
		'./src/frontend/core/index.jsx'
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: ['node_modules', 'src/frontend', 'src/common', 'src']
	},
	output: {
		path: path.join(__base, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'

	},
	plugins: [
		new webpack.optimize.OccurrenceOrderPlugin()
		, new webpack.optimize.UglifyJsPlugin({
			sourceMap: true
			, compress: {
				warnings: false
			}
		})
		, new ExtractTextPlugin({
			filename: "css/styles.css"
			, disable: false
			, allChunks: true
		})
	],
	module: {
		rules: [{
			test: /\.jsx?$/,
			exclude: /(node_modules|bower_components)/,
			use: {
				loader: "babel-loader?cacheDirectory=true"
			}
		}, {
			test: /\.(png|jpg|gif|jpeg)$/
			, use: {
				loader: 'url-loader?limit=8192'
			}
		}
		, {
			test: /\.css$/
			, use: {
				loader: 'style!css'
			}
		}
		, {
			test: /\.scss$/
			, exclude: /(node_modules|bower_components)/
			, use: ExtractTextPlugin.extract({
				fallback: "style-loader"
				, use: [{
	                loader: "css-loader" // translates CSS into CommonJS
	            }, {
	                loader: "sass-loader" // compiles Sass to CSS
	            }]
			})
		}
	]}
};


console.log(module.exports)