'use strict'

var express = require('express');
var fs = require('fs');
var colors = require('colors');

module.exports = {
	initRouter: function(__dir, app, _router){
		var router = _router || express.Router();
	
		fs.readdirSync(__dir + '/').forEach(function(name){
			if(name == 'index.js' || name[0] == '.')
				return;

			var matched = name.match(/(.*?)(\.js)?$/);
			name = matched[1];

			logger.info('- router', colors.magenta('/' + name), colors.red(name));
				
			router.use('/' + name, require(__dir + '/' + name)(app));
		});

		router.use('*', (req, res)=>res.status(404).send({}))

		return router;
	}
}