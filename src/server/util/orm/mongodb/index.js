var Q = require('q');

function driver(model){
	this.model = model;

	this._find = Q.nbind(model.find, model);
	this._findOne = Q.nbind(model.findOne, model);
}

driver.prototype = {
	_create: function(doc){
		return new this.model(doc);
	}
	, create: function(doc){
		return this._create(doc).save()
		.then(()=>doc);
	}
	, createAndGet: function(doc){
		var _doc = this._create(doc);
		return _doc.save()
		.then(()=>_doc);
	}
	, find: function(user, query, option){
		if(user)
			query.userId = user._id;
		
		return this._find(query, null, option);
	}
	, findOne: function(user, query, option){
		if(user)
			query.userId = user._id;

		return this._findOne(query, null, option);
	}
	, findOneById: function(user, _id, option){
		var query = {}
		if(user)
			query.userId = user._id;
		query._id = _id;

		return this._findOne(query, null, option);
	}
}

module.exports = function(connection, collectionName){
	var model = connection.model(collectionName);

	try{
		var obj = require(`./_${name}`)();
		obj.__proto__ = new driver(model);
		return obj;
	}
	catch(e){
		return new driver(model);
	}	
}