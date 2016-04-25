'use strict'

module.exports = function(app){
	app.get('/:a?', function(req, res){
		let state = {global: {config: {demo_text: 'Hello World!'}}};
		res.renderIndex(state);
	});

	app.use('/v1', require('api')(app));
}
