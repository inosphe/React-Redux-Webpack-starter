'use strict'

var routerUtil = require('util/routerUtil');

module.exports = function(app){
	let router = routerUtil.initRouter(__dirname, app, undefined, routerUtil.auth(1));
	var orm_webpage = app.database.db0.webpage;

	router.get('/:_id', function(req, res){
		orm_webpage.findOneById(req.user, req.params._id)
		.then(doc=>{
			res.send(doc);
		})
		.fail(fallback(res))
	})

	router.put('/archive', function(req, res){
		archive(req.user, req.params._id)
		.then(doc=>{
			return {item: doc}
		})
	})

	return router;
}