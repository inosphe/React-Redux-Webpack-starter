'use strict'

var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var Q = require('q');

module.exports = function(app){
	var orm_account = app.database.db0.account;

	return function(req, res, next){
		var options = {};
		var defer = Q.defer();
		passport.authenticate('local-login', options, function(err, user, info){
			console.log('login', user, info);

			req.logIn(user, options, function(err) {
				if (err) {
					logger.error(err);
					defer.reject({message: 'server error.'});
				}
				else if(user){
					defer.resolve(user);
				}
				else{
					defer.reject(info)
				}
			});

		}).apply(this, arguments);

		return defer.promise
		.then(user=>next())
		.fail(info=>res.status(400).send(info))
	}
}