var winston = require('winston');

var filename = 'logs/debug.log'
module.exports = function(level){
	var logger = new winston.Logger({
		level: 'debug',
		transports: [
			new (winston.transports.Console)(),
			new (winston.transports.File)({ filename: filename })
		]
	});

	return logger;
};