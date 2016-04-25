var express 		= require('express');
var bodyParser		= require('body-parser')
var path			= require('path');

module.exports = function(app){
	Object.defineProperty(global, '_', {
		value: require('lodash')
		, configurable: false
	})

	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());

	app.use('/dist', express.static(`${__base}/dist`));

	app.needAuthorization = function(req, res, next){
		if(!req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}

	app.needUnathorization = function(req, res, next){
		if(req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}
}
