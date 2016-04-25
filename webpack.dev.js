var webpack = require("webpack");
var WebpackDevServer = require("webpack-dev-server");
var _ = require("lodash");

global.__base = __dirname;

var config = require('./config/config')
if(!config || !config.assets){
	throw new Error("Server config lacks of assets setting.")
}

var webpack_config_opt = _.extend({}, config.assets);
webpack_config_opt.server = true;
var webpack_config = require("./config/webpack.config.dev.js")(webpack_config_opt);

const front_server = new WebpackDevServer(webpack(webpack_config), {
  publicPath : config.assets.path
  , hot: true
});

front_server.listen(config.assets.port, config.assets.host);