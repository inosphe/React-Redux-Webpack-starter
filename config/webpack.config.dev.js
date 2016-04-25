var path = require('path');
var webpack = require('webpack');
var __base = global.__base || __dirname;
var _ = require('lodash');

module.exports = function(opt){
	opt = opt || {};
	opt = _.defaults(opt, {
		server: false
		, host: 'localhost'
		, port: '8080'
		, path: '/dist'
	})

	return {
		// or devtool: 'eval' to debug issues with compiled output:
		devtool: 'source-map',
		entry: [
			// necessary for hot reloading with IE:
			'eventsource-polyfill',
			// listen to code updates emitted by hot middleware:
			opt.server?
				`webpack-dev-server/client?http://${opt.host}:${opt.port}`
				:'webpack-hot-middleware/client',
			'webpack/hot/dev-server',
			// your code:
			'./src/frontend/core/index.jsx'
		],
		resolve: {
			extensions: ['', '.js', '.jsx'],
			modulesDirectories: ['node_modules', 'src/frontend']
		},
		output: {
			path: path.join(__base, opt.path),
			filename: 'bundle.js',
			publicPath: opt.server?`http://${opt.host}:${opt.port}${opt.path}/`:`${opt.path}/`

		},
		plugins: [
			new webpack.HotModuleReplacementPlugin()
			, new webpack.NoErrorsPlugin()
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
			, { test: /\.scss$/, loader: 'style!css!sass'}
		]}
	};

}