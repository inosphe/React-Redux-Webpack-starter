'use strict'

var webpack = require('webpack');
var webpackDevMiddleware = require('webpack-dev-middleware');
var webpackHotMiddleware = require('webpack-hot-middleware');

var webpackConfig = getConfig('webpack.config.dev');

function initWebpack(app){
	if(process.env.NODE_ENV !== 'production'){
		logger.info('webpack - hotmodule mode.');
		const compiler = webpack(webpackConfig);
		app.use(webpackDevMiddleware(compiler, { noInfo: true, publicPath: webpackConfig.output.publicPath }));
		app.use(webpackHotMiddleware(compiler));
	}
}

module.exports = initWebpack;