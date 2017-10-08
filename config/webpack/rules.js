module.exports = [{
	test: /\.jsx?$/,
	exclude: /(node_modules|bower_components)/,
	use: {
		loader: "babel-loader?cacheDirectory=true"
	}
}, {
	test: /\.(png|jpg|gif|jpeg)$/
	, use: {
		loader: 'url-loader?limit=8192'
	}
}
, {
	test: /\.css$/
	, use: {
		loader: 'style!css'
	}
}
, {
	test: /\.scss$/
	, use: {
		loader: 'style!css!sass'
	}
}]