var _ = require('lodash');

var process = require('process');
var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var _ = require("lodash");

global.__base = __dirname;

var webpack_config = require("./config/webpack.config.dev.js");
var server_config = require('./config/webpack.dev-server.json')

console.log(_.pick(process.env, 'NODE_ENV', 'BABEL_ENV'))
if(process.env.BABEL_ENV != 'development'){
	console.warn('this is not development. React-Hot-Loader will not added');
}

console.log(webpack_config)
const front_server = new WebpackDevServer(webpack(webpack_config), {
  publicPath : server_config.path
  , hot: true
  , headers: { "Access-Control-Allow-Origin": "*" }
});

// if(process.env.NODE_ENV == 'development'){
// 	var cors = require("cors");
// 	front_server.app.use(cors());
// }

front_server.listen(server_config.server.port, server_config.server.host);