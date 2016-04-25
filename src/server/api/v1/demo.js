'use strict'

let express = require('express');

module.exports = function(app){
	let router = express.Router();

	router.get('/', function(req, res){
		res.send({text: 'V1 Demo Text.'});
	})

	return router;
}