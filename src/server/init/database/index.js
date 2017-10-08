var promiseMapSeries = require('promise-map-series');
var Q = require('q');
var orm = require('orm');

module.exports = function(app){
	var self = this;
	var __connection__ = {}
	this.__connection__ = __connection__;
	
	app.database = self;

	return Q(promiseMapSeries(app.config.database, function(db){
		return require(`./${db.type}`)(app, db.address)
		.then(connection=>{
			console.log(db);
			_.each(_.flatten([db.alias]), _alias=>{
				__connection__[_alias] = connection;
				self[_alias] = {};
			});

			return promiseMapSeries(_.flatten([db.model]), _model=>{
				return Q(require(`models/${_model}`)(connection))
				.then(()=>{
					console.log(_model, db.type);
					var ormObj = orm(app, connection, _model, db.type);
					_.each(_.flatten([db.alias]), _alias=>{
						self[_alias][_model] = ormObj;
					});
				})
			});

		});
	}))
	.fail(logger.error);
}