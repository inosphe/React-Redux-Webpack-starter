'use strict'

var express = require('express');
var fs = require('fs');
var colors = require('colors');

module.exports = {
	initRouter: function(__dir, app, _router, _use){
		var router = _router || express.Router();

		if(_use){
			router.use('*', _use);
		}
	
		fs.readdirSync(__dir + '/').forEach(function(name){
			if(name == 'index.js' || name[0] == '.' || name[0] == '_')
				return;

			var matched = name.match(/(.*?)(\.js)?$/);
			name = matched[1];

			logger.info('- router', colors.magenta('/' + name), colors.red(name));
				
			router.use('/' + name, require(__dir + '/' + name)(app));
		});

		router.use('*', (req, res)=>res.status(404).send({}))

		return router;
	}
	, auth: function(level, redirect){
		return function(req, res, next){
			if(level>0 && (!req.isAuthenticated() || req.user.level<level)){
				if(redirect){
					res.redirect(redirect);
				}
				else{
					res.status(403).send({code: 403, message: 'not privileged.'});
				}
			}
			else{
				next();
			}
		}
	}
}