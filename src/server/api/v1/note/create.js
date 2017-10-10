'use strict'

var express = require('express');
var Q = require('q');

module.exports = function(app){
	var router = express.Router();
	var orm_note = app.database.db0.note;

	router.post('/', function(req, res){
		orm_note.create({userId: req.user._id})
		.then(item=>res.send({item: item, created: true}))
		.fail(fallback(res))
	})

	return router;
}