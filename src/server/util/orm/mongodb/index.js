var Q = require('q');
var makeObject = require('common/utils/makeObject');

function driver(app, model){
	this.app = app;
	this.model = model;

	this._create = Q.nbind(model.create, model);
	// this._find = Q.nbind(model.find, model);
	this._findOne = Q.nbind(model.findOne, model);
	this._update = Q.nbind(model.update, model);
	this._remove = Q.nbind(model.remove, model);
}

driver.prototype = {
	create: function(doc){
		return this._create(doc);
	}
	, _find: function(doc, proj, option){
		return this.model.find(doc, proj, option);
	}
	, find: function(user, query, option){
		if(user){
			query = query || {}
			query.userId = user._id;
		}

		if(option && option.limit){
			option.limit = Number(option.limit);
		}

		var q = this._find(query, null, option);
		if(option && option.populate){
			_.each(option.populate, v=>q.populate(v));
		}
		
		return Q(q.exec());
	}
	, findOne: function(user, query, option){
		if(user)
			query.userId = user._id;

		return this._findOne(query, option&&option.proj, option);
	}
	, findOneById: function(user, _id, option){
		var query = {}
		if(user)
			query.userId = user._id;
		query._id = _id;

		var proj;
		if(option && option.proj){
			proj = makeObject(option.proj, (v, k, itr)=>itr(v, 1));
		}

		return this._findOne(query, proj, option);
	}

	, getModel: function(obj, option){
		console.log('getModel', typeof obj, obj._id);
		if(typeof obj == 'object' && obj._id){
			return Q(obj);
		}
		else{
			return this.findOneById(undefined, obj, option);
		}
	}

	, setOneById: function(user, _id, doc, option){
		var query = {};
		if(user)
			query.userId = user._id;
		if(_id)
			query._id = _id;

		var opt = {};
		if(option && option.new){
			opt.new = option.new;
		}
		
		var q = this.model.findOneAndUpdate(query, {$set: doc}, opt);
		if(option && option.populate){
			_.each(option.populate, v=>q.populate(v));
		}
		return Q(q.exec());
	}

	, updateOneById: function(user, _id, up, option){
		var query = {};
		if(user)
			query.userId = user._id;
		if(_id)
			query._id = _id;

		var opt = {};
		if(option && option.new){
			opt.new = option.new;
		}
		
		var q = this.model.findOneAndUpdate(query, up, opt);
		if(option && option.populate){
			_.each(option.populate, v=>q.populate(v));
		}
		return Q(q.exec());
	}

	, updateOne: function(user, query, up, option){
		query = query || {};
		if(user)
			query.userId = user._id;

		var opt = {};
		if(option && option.new){
			opt.new = option.new;
		}
		
		var q = this.model.findOneAndUpdate(query, up, opt);
		if(option && option.populate){
			_.each(option.populate, v=>q.populate(v));
		}
		return Q(q.exec());
	}

	, update: function(user, query, doc, opt){
		query = query || {};
		if(user)
			query.userId = user._id;
		return this._update(query, doc, opt);
	}

	, count: function(user, query){
		query = query || {};
		if(user)
			query.userId = user._id;

		return Q(this.model.count(query).exec());
	}

	, removeById: function(user, _id){
		var query = {
			userId: user._id
			, _id
		}

		return this._remove(query);
	}
}

module.exports = function(app, connection, collectionName){
	var model = connection.model(collectionName);
	var constructor;

	logger.debug('initializing orm', collectionName);

	try{
		constructor = require(`./_${collectionName}`);
	}
	catch(e){
		if(e.code != 'MODULE_NOT_FOUND'){
			logger.error(e);
			logger.info(e.stack);
		}
	}	

	if(constructor){
		logger.info(`custom mongo driver "${collectionName}" found.`);
		var obj = new constructor(app, model);
		obj.__proto__.__proto__ = new driver(app, model);
		return obj;
	}
	else{
		return new driver(app, model);
	}
}