var jsdom = require("jsdom");
var urllib = require('url');
var Q = require('q');
var path = require('path');

var regext = /^.*\.(.*)$/;

function urlProcessor(dirpath, host){
	var hostObj = urllib.parse(host);

	var hostDefault = {
		hostname: hostObj.hostname
		, host: null
		, port: hostObj.port
		, protocol: 'http'
		, slashes: true
	};

	var pathbase = (function(pathname){
		var pathnames = pathname.split('/');
		return pathnames.slice(0, pathnames.length-1).join('/');
	})(hostObj.pathname);

	function gurl(url){	//parsed
		return url;
	}

	function lurl(url, filename){	//local url
		var urlObj = urllib.parse(url);
		if(filename){
			url = path.resolve(path.dirname(urlObj.pathname), filename);
		}
		else{
  			url = urlObj.pathname;

		}
		url = url.replace(/^\//, '');
		url = (dirpath && dirpath.length)?(dirpath+'/'+url):url;
		return url;
	}

	function preprocess(url){
		//replace relative address to absolute(http)
		url = url.replace(/^\/\//, 'http://');	
		var urlObj = urllib.parse(url);
		
		var pathname = urlObj.pathname;
		if(!pathname || !pathname.length){
			return url;
		}

		//fill url host
		//if url is relative, hostname will be filled
		if(urlObj.host || urlObj.hostname){
			_.each(hostDefault, (v,k)=>{
				urlObj[k] = urlObj[k] || v;
			})	
			return urllib.format(urlObj);
		}

		if(pathname[0] != '/' || pathname.match(/^\.\./)){
			pathname = pathbase + '/' + pathname;
		}
		else{
			pathname = pathname;
		}

		var pathnames = pathname.split('/');
		for(var i=1; i<pathnames.length; ){
			if(pathnames[i] == '..'){
				pathnames.splice(i-1, 2);
				--i;
			}
			else{
				++i;
			}
		}

		_.each(hostDefault, (v,k)=>{
			urlObj[k] = urlObj[k] || v;
		})
		urlObj.pathname = pathnames.join('/');
		url = urllib.format(urlObj);
		return url;
	}

	var resourceId = 0;
	function getResourceUrl(url, nodeType){
		var id = resourceId++;
		console.log('getImageUrl', url);
		if(!url || !url.length){
			return null;
		}

		url = preprocess(url);

		var urlObj = urllib.parse(url);
		var filename;
		if(urlObj.query){
			var ext = path.extname(urlObj.pathname);
			var name = path.basename(urlObj.pathname, ext);
			console.log(urlObj.pathname, name, ext);
			filename = name + (id!==undefined?id:Math.floor(100000*Math.random())) + ext;
		}

		// console.log({
		// 	url, filename, gurl: gurl(url), lurl: lurl(url)
		// })

		return {
			url: gurl(url)
			, type: nodeType
			, filepath: lurl(url, filename)
			, filename: filename	//only used for override
		}
	}

	function getHTMLUrl(url){
		var id = resourceId++;
		url = preprocess(url);

		var urlObj = urllib.parse(url);
							
		if(urlObj.host || urlObj.hostname){
			return null;
		}

		else{
			var dirname = this.nodeName + id;
			try{
				var filepath = (dirpath && dirpath.length)
					? path.resolve(dirpath, dirname, 'index.html')
					: path.resolve(dirname, 'index.html')
			}
			catch(e){
				console.log(e);
				console.log(dirpath, dirname);
			}
			
			return {
				url: gurl(url)
				, type: 'html'
				, dirname: dirname
				, filepath: filepath
			}
		}
	}

	function getDirectUrl(url){
		if(!url || !url.length){
			return url;
		}
		
		return gurl(preprocess(url));
	}

	return {
		preprocess
		, getHTMLUrl
		, getResourceUrl
		, getDirectUrl
	}
}

module.exports = urlProcessor;