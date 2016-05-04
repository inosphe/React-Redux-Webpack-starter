var mongoose 	= require('mongoose');
var Q			= require('q');

module.exports = function(app, db_address){
	var deferred = Q.defer();

	logger.info('mongodb - ', db_address)
	logger.info('connecting ...');

	var connection = mongoose.createConnection(db_address);
	connection.on('error', function(err){
		logger.error('mongodb connection error.');
		logger.info(err);

		deferred.reject();
	});
	connection.once('open', function(){
		logger.info('mongodb - connected.');
		deferred.resolve(connection);
	});

	return deferred.promise;
}