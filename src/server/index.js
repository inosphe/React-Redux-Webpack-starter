'use strict'

var express = require('express');
var _ = require('lodash');
var promiseMapSeries = require('promise-map-series');
var colors = require('colors/safe');

Object.defineProperty(global, '_', {
	value: require('lodash')
	, configurable: false
})

Object.defineProperty(global, 'logger', {
	value: require('./init/logger')('debug')
	, configurable: false
	, enumerable: true
})

var logs = ['process.env.NODE_ENV'];
logger.info('Environments')
for(var i in logs){
	logger.info('-', colors.red(logs[i]), eval(logs[i]));
}

module.exports = function(opt){
	var app = new express();
	opt = opt || {};
	opt.rootdir = opt.rootdir || __dirname;
	_.extend(app, opt);

	app.config = getConfig('config');

	app.init = function(modules){
		return promiseMapSeries(modules, function(moduleName){
			logger.info(colors.yellow(moduleName));
			try{
				var mod = require(`./${moduleName}`);
				if(typeof mod == 'function'){
					var ret = mod(app);
					logger.info(colors.yellow(moduleName), colors.bgCyan.black('F'), 'initialized.');
					return ret;
				}
				else{
					logger.info(colors.yellow(moduleName), 'initialized.');
					return mod;
				};
			}
			catch(e){
				logger.error(e, e.stack.split('\n'));
			}
		})
	}

	app.start = function(){
		var port = app.config.port || 3000;

		var init_list = [
			'init/database'
			, 'init/express'
			, 'init/renderStatic'
			, 'routers'
			, 'init/authorize/passport'
		
		];

		if(!app.config.assets.standalone)
			init_list.unshift('init/webpack');

		return this.init(init_list)
		.then(function(){
			app.listen(port);
			_.each(app.tests, func=>func());
			logger.info('*** server is running on', port);
		});
	}

	return app;
}
