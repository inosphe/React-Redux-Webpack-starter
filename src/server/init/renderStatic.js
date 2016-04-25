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

	function renderIndex(t){
		this.send(compiled(t));
	}

	app.use(function(req, res, next){
	 	res.render = render
	 	res.renderIndex = renderIndex
	 	next();
 	});
}

module.exports = renderStatic;