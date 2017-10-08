var path = require('path');
var webpack = require('webpack');
var __base = global.__base || __dirname;
var _ = require('lodash');

opt = require('./webpack.dev-server.json')
opt_server = _.defaults(opt.server, {host: '0.0.0.0', port: 3000})

module.exports = {
	// or devtool: 'eval' to debug issues with compiled output:
	devtool: 'source-map',
	entry: [
  		'babel-polyfill',
		// necessary for hot reloading with IE:
		'eventsource-polyfill',
		// listen to code updates emitted by hot middleware:
		`webpack-dev-server/client?http://${opt_server.host}:${opt_server.port}`,
		'webpack/hot/dev-server',
		// 'webpack/hot/only-dev-server',
		'react-hot-loader/patch',
		// your code:
		'./src/frontend/core/index.jsx'
	],
	resolve: {
		extensions: ['.js', '.jsx'],
		modules: ['node_modules', 'src/frontend', 'src/common']
	},
	output: {
		path: path.join(__base, opt.path),
		filename: 'bundle.js',
		publicPath: opt.server?`http://${opt.server.host}:${opt.server.port}${opt.path}/`:`${opt.path}/`

	},
	plugins: [
		new webpack.HotModuleReplacementPlugin()
		, new webpack.DefinePlugin({
	    	'process.env': {
	    		'NODE_ENV': JSON.stringify('development')
	    		, 'BABEL_ENV': JSON.stringify('development')
	    	}
	    })
		, new webpack.NoEmitOnErrorsPlugin()
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
			, use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader"
            }]
		}
		, {
			test: /\.scss$/
			, use: [{
                loader: "style-loader" // creates style nodes from JS strings
            }, {
                loader: "css-loader" // translates CSS into CommonJS
            }, {
                loader: "sass-loader" // compiles Sass to CSS
            }]
		}
	]}
};
