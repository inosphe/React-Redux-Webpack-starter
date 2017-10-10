'use strict'

var routerUtil = require('util/routerUtil');

module.exports = function(app){
	let router = routerUtil.initRouter(__dirname, app, undefined, routerUtil.auth(1));
	
	router.get('/:_id/a', function(req, res){
		console.log(req.params);
		console.log('filepath', req.params.filepath);
		res.sendFile('index.html', {root: `./data/archive/${req.params._id}`});
	})

	router.get('/:_id/a/:filepath*', function(req, res){
		console.log(req.params);
		console.log('filepath', req.params.filepath);
		res.sendFile(req.params.filepath+req.params[0], {root: `./data/archive/${req.params._id}`});
	})

	router.use('/:_id/a', function(req, res){
		res.status(404).send();
	})

	return router;
}