'use strict'

let express = require('express');
let routerUtil = require('util/routerUtil');

module.exports = function(app){
	app.use('/v1', require('api')(app));

	let router = routerUtil.initRouter(__dirname, app);
	
	router.get('*', function(req, res){
		let state = {
			global: {config: {demo_text: 'Hello World!'}}
			, account: {
				loggedIn: req.user!=null
				, user: _.pick(req.user, '_id', 'email')
			}
		};
		res.renderIndex(state);
	});

	app.use(router);
}
