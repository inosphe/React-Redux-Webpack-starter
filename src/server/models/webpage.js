'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Types = Schema.Types;
var ObjectId = Types.ObjectId;

module.exports = function(connection){
	var annoSchema = Schema({
		text: [String]
	});

	var extraNoteSchema = Schema({
		type: String
		, text: String
		, embed: ObjectId
	});

	var schema = Schema({
		userId: ObjectId
		, title: {type: String, default: 'untitled'}
		, url: {type:String, default: ''}
		, date_created: {type:Date, default: Date.now}
		, archived: {type: Number, default: 0}
	});

	schema.index({
		'userId':1
		, 'date_created': -1
	});

	schema.index({
		'userId':1
	});

	schema.index({
		'userId':1
		, 'url': 1
	});

	schema.index({
		userId: 1
		, title: 'text'
	});

	connection.model('webpage', schema);
}	