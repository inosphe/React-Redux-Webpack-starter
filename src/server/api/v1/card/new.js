'use strict'

var express = require('express');

module.exports = function(app){
	var router = express.Router();
	var orm_card = app.database.db0.card;

	router.post('/', function(req, res){
		console.log(req.body);

		var doc = _.pick(req.body, 'title', 'url', 'note');
		doc.userId = req.user._id;
		
		orm_card.create(doc)
		.then(ret=>res.send(ret))
	})

	return router;
}