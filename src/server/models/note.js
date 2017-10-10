'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

var NoteCellType = require('common/constants/noteCellType');
var EmbeddingType = require('common/constants/embeddingType');

module.exports = function(connection){
	var noteCell = Schema({
		type: Number
		, embed: {type: Types.Mixed}
		, content: String
	})

	var schema = Schema({
		userId: ObjectId
		, title: {type: String, default: 'untitled'}
		, date_created: {type:Date, default: Date.now}
		, date_modified: {type:Date, default: Date.now}
		, contents: [noteCell]
	});

	schema.index({
		'userId':1
		, 'date_created': -1
	});

	schema.index({
		'userId':1
		, 'date_modified': -1
	});

	schema.index({
		'userId':1
	});

	schema.index({
		userId: 1
		, title: 'text'
	});

	connection.model('note', schema);
	connection.model('noteCell', noteCell);
}	