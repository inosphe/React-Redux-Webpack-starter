'use strict'

var express = require('express');

module.exports = function(app){
	var router = express.Router();
	var orm_note = app.database.db0.note;

	router.get('/', function(req, res){
		var url = req.param('url');

		orm_note.find(req.user)
		.then(ret=>res.send(ret))
		.fail(fallback(res))
	})

	return router;
}