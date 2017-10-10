var process = require('process');

module.exports = {
	index : "frontend/core/index.html"
	, database: [{
		type: 'mongodb'
		, alias: ['default','db0', 'session']
		, model: ['account', 'webpage', 'note']
		, address: 'localhost'
	}]
	, assets: process.env.NODE_ENV=='development'?
		require('./webpack.dev-server.json'):
		{
			path: "/dist"
		}
}
