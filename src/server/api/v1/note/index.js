'use strict'

var express = require('express');
var routerUtil = require('util/routerUtil');
var mongoose = require('mongoose');

module.exports = function(app){
	let router = routerUtil.initRouter(__dirname, app, undefined, routerUtil.auth(1));
	
	var orm_note = app.database.db0.note;
	var orm_webpage = app.database.db0.webpage;

	router.get('/:_id', function(req, res){
		orm_note.findOneById(req.user, req.params._id)
		.then(item=>{
			res.send(item)
		})
		.fail(fallback(res))
	})

	router.put('/:_id/add', function(req, res){
		let body = req.body;

		console.log('body', body);

		if(body.url){
			makeNoteCell_WebPage(req.user, body.url)
			.then(cell=>{
				console.log('cell', cell);
				if(cell)
					var Model = mongoose.model('noteCell');
					return orm_note.updateOneById(req.user, req.params._id, {new: true, $push: {new: true, contents: new Model(cell)}})
			})
			.then(doc=>{
				res.send({item: doc});
			})
			.fail(fallback(res))
		}
	})

	var NoteCellType = require('common/constants/noteCellType');
	var EmbeddingType = require('common/constants/embeddingType');

	function makeNoteCell_WebPage(user, url){
		return orm_webpage.get(user, url)
		.then(doc=>{
			console.log('makeNoteCell_WebPage doc', doc);
			return {
				type: NoteCellType.WebPage
				, embed: {
					type: EmbeddingType.WebPage
					, _id: doc._id
					, url: doc.url
				}
			}
		})
	}

	return router;
}