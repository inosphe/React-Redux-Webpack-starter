var express = require('express');
var Q = require('q');

module.exports = function(app){
	var router = express.Router();

	router.use('*', function(req, res, next){
		logger.debug(req.originalUrl, req.body);
		next();
	})

	router.post('/signin', require('./_signin')(app), function(req, res){
		res.send({user: req.user});
	})

	var _signup = require('./_signup')(app);
	router.post('/signup', function(req, res){
		_signup(req.body)
		.then(Q.nbind(req.logIn, req))
		.then(()=>{
			console.log(req.user);
			res.send({user: req.user});
		})
		.fail(err=>{
			console.log(err.stack);
			res.status(400).send(err)
		});
	})

	router.get('/logout', function(req, res){
		req.logout();
		res.send({user: null});
	})

	return router;
}