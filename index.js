global.__base = __dirname;
global.__src = __dirname + '/src';

global.getConfig = function(name){
	return require(__dirname + '/config/' + name);
}

require('app-module-path').addPath(`${__src}/server`);
require('app-module-path').addPath(`${__src}/server/util`);
require('app-module-path').addPath(`${__src}/`);

var app = require('./src/server')({
	rootdir: __dirname
});

app.start();
