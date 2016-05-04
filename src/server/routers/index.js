'use strict'

module.exports = function(app){
	app.get('/:a?', function(req, res){
		let state = {
			global: {config: {demo_text: 'Hello World!'}}
			, account: {
				loggedIn: req.user!=null
				, user: _.pick(req.user, '_id', 'email')
			}
		};
		res.renderIndex(state);
	});

	app.use('/v1', require('api')(app));
}
