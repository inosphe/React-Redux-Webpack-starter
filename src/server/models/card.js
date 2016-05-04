'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

module.exports = function(connection){
	var schema_URL = mongoose.Schema({
		url: {type:String, default: '', es_indexed: true}
		, host: {type:String, default: ''}
	});

	var schema = Schema({
		userId: ObjectId
		, title: {type: String, default: 'untitled', es_indexed: true}
		, tags: [{type: ObjectId, ref: 'Tag'}]
		, url: [schema_URL]
		, others: {
			pocket: {
				id: String
			}
		}
		, note: Types.Mixed
		, date_created: {type:Date, default: Date.now}
		, date_modified: {type:Date, default: Date.now}
	});

	schema.index({
		'userId':1
		, 'date': -1
	});

	schema.index({
		'userId':1
		, 'tags':1
	});

	connection.model('card', schema);
}	