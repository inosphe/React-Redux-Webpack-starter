'use strict'

var express = require('express');

module.exports = function(app){
	var router = express.Router();
	var orm_webpage = app.database.db0.webpage;

	router.get('/', function(req, res){
		var url = req.param('url');
		orm_webpage.get(req.user, url)
		.then(ret=>res.send(ret))
		.fail(e=>{
			console.error(e);
			res.send(400)
		})
	})

	return router;
}