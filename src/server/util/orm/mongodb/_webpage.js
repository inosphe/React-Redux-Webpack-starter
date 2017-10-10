var Q = require('q');

var lib_archive = require('lib/archive');

function driver(app){}

driver.prototype = {
	get: function(user, url){
		return this.findOne(user, {url: url})
		.then(doc=>{
			console.log('doc', doc)
			if(doc){
				return doc;
			}
			else{
				return this.create({
					userId: user._id
					, url: url
				})
			}
		})
		.then(doc=>{
			console.log('get', doc);

			if(doc.archived == 0)
				return this.archive(user, doc._id)
			else
				return doc;
		})
	}
	, archive: function(user, _id, force){
		var allowed_status = [0, 2];
		if(force){
			allowed_status.push(1);
		}

		console.log('archive', _id)

		return this.updateOne(user, {_id: _id, archived: {$in: allowed_status}}, {$set: {archived: 1}})
		.then(doc=>{
			if(doc){
				return lib_archive(doc.url, doc._id, true)
				.then(()=>{
					return this.setOneById(user, _id, {archived: 2}, {new: true})
				})
			}
			else{
				return doc;
			}
		})
		.fail(err=>{
			logger.error(err);
			return this.setOneById(user, _id, {archived: 0}, {new: true})
		})
	}
}

module.exports = driver;

