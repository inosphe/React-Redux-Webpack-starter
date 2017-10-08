'use strict'

var path = require('path');
var fs = require('fs');
var _ = require('lodash');

function renderStatic(app){
	var indexFilePath = path.resolve(__src, app.config.index);
	var compiled = _.template(fs.readFileSync(indexFilePath));

 	function render(filename){
		this.sendFile(path.resolve(__base, `dist/${__filename}`));
	}

	function renderIndex(initialState){
		var assetsPath = app.config.assets.server
			? `http://${app.config.assets.server.host}:${app.config.assets.server.port}${app.config.assets.path}`
			: app.config.assets.path;

		var t = {
			initialState: JSON.stringify(initialState)
			, html: ''
			, assetsPath: assetsPath
		}

		this.send(compiled(t));
	}

	app.use(function(req, res, next){
	 	res.render = render
	 	res.renderIndex = renderIndex
	 	next();
 	});
}

module.exports = renderStatic;