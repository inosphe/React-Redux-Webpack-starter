'use strict'

var routerUtil = require('util/routerUtil');

module.exports = function(app){
	return routerUtil.initRouter(__dirname, app, undefined, routerUtil.auth(1));
}