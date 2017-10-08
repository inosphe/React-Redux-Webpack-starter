var process			= require('process')
var express 		= require('express');
var bodyParser		= require('body-parser')
var path			= require('path');
var session 		= require('express-session');
var passport 		= require('passport');
var connect_mongo	= require('connect-mongo')(session);

module.exports = function(app){
	app.use(bodyParser.urlencoded({ extended: true }))
	app.use(bodyParser.json());

	var hour = 3600000;
	app.use(session({
		secret: 'session-secret'
		, cookie: {
			path: '/'
			, httpOnly: true
			, maxAge: hour * 24 * 7
			, secure: false
		}
		, resave: true
		, saveUninitialized: true
		, store: new connect_mongo({
			mongooseConnection: app.database.__connection__.session
			, collection: 'sessions'
		})
	}))

	if(process.env.NODE_ENV == 'development'){
		var cors = require("cors");
		app.use(cors());
	}


	app.use(passport.initialize());
	app.use(passport.session());

	app.use('/dist', express.static(`${__base}/dist`));

	app.needAuthorization = function(req, res, next){
		if(!req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}

	app.needUnathorization = function(req, res, next){
		if(req.user){
			res.redirect(app.config.index);
		}
		else{
			next();
		}
	}
}
