module.exports = {
	index : "frontend/core/index.html"
	, assets: {
		host: 'localhost'
		, port: 8080
		, path: '/dist'
		, standalone: true
	}
	, database: [{
		type: 'mongodb'
		, alias: ['default','db0', 'session']
		, model: ['account', 'card']
		, address: 'localhost'
	}]
}
