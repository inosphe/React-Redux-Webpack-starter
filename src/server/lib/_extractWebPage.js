var jsdom = require("jsdom");
var urllib = require('url');
var Q = require('q');

var regext = /^.*\.(.*)$/;

function extractWebPage(dirpath, url, cardId){
	console.log('extractWebPage', dirpath, url, cardId);
	var urlObj = urllib.parse(url);

	var d = {
		hostname: urlObj.hostname
		, host: urlObj.host
		, port: urlObj.port
		, protocol: 'http'
		, slashes: true
	};

	var base = (function(pathname){
		var pathnames = pathname.split('/');
		return pathnames.slice(0, pathnames.length-1).join('/');
	})(urlObj.pathname)

	function gurl(src){ //parsed
		return src;
	}

	function lurl(src, filename){
		var srcObj = urllib.parse(src);
  		src = srcObj.pathname;
		src = src.replace(/^\//, '');
		src = (dirpath && dirpath.length)?(dirpath+'/'+src):src;
		if(filename)
			src = src + filename;
		return src;
	}

	function preprocess(src){
		src = src.replace(/^\/\//, 'http://');
		var srcObj = urllib.parse(src);
		
		var pathname = srcObj.pathname;
		if(!pathname || !pathname.length){
			return src;
		}

		if(srcObj.host || srcObj.hostname){
			_.each(d, (v,k)=>{
				srcObj[k] = srcObj[k] || v;
			})	
			return urllib.format(srcObj);
		}

		if(pathname[0] != '/' || pathname.match(/^\.\./)){
			pathname = base + '/' + pathname;
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

		_.each(d, (v,k)=>{
			srcObj[k] = srcObj[k] || v;
		})
		srcObj.pathname = pathnames.join('/');
		src = urllib.format(srcObj);
		return src;
	}

	function getImageSrc(src, id){
		console.log('getImageSrc', src);
		if(!src || !src.length){
			return null;
		}

		src = preprocess(src);

		var srcObj = urllib.parse(src);
		var filename;
		if(srcObj.query){
			filename = 'img' + id;
		}

		console.log({
			src: gurl(src)
			, type: 'image'
			, filepath: lurl(src, filename)
			, filename
		})

		return {
			src: gurl(src)
			, type: 'image'
			, filepath: lurl(src, filename)
			, filename
		}
	}

	function getHTMLSrc(src){
		src = preprocess(src);

		var srcObj = urllib.parse(src);
							
		if(srcObj.host || srcObj.hostname){
			return null;
		}

		else{
			var dirname = this.nodeName + idCounter++;
			var filepath = (dirpath && dirpath.length)
				? `${dirpath}/${dirname}/index.html`
				: `${dirname}/index.html`
			
			return {
				src: gurl(src)
				, type: 'html'
				, dirname: dirname
				, filepath: filepath
			}
		}
	}

	function getDirectSrc(src){
		if(!src || !src.length){
			return src;
		}
		
		return gurl(preprocess(src));
	}

	function getCSSSrc(src){
		if(!src || !src.length){
			return null;
		}

		src = preprocess(src);

		return {
			src: gurl(src)
			, type: 'css'
			, filepath: lurl(src)
		}
	}
	
	function extract(){
		var deferred = Q.defer();
		var idCounter = 0;

		jsdom.env({
			url: url,
			scripts: ["http://code.jquery.com/jquery.js"],
			done: function (errors, window) {
				try{
					var childScripts = [];
					var $ = window.$;

				  	window.$('script').remove();

			  		
				  	$('[src]').each(function(){
						var src = this.getAttribute('src');
				  		idCounter++;

				  		console.log(this.nodeName);

						if(this.nodeName == 'IMG'){
							var obj = getImageSrc(src, idCounter);
					  		if(obj){
					  			childScripts.push(obj);
				  				this.setAttribute('src', obj.filepath);
				  			}
						}
						else if(this.nodeName == 'FRAME' || this.nodeName == 'IFRAME'){
							if(!src || !src.length){
								return;
							}
							var obj = getHTMLSrc(src);
							if(obj){
								childScripts.push(obj);
								this.setAttribute('src', obj.filepath);
							}
						}
						else{
							this.setAttribute('src', getDirectSrc(src));
						}
				  	})

				  	//jquery plugin
				  	$('.thumb-image').each(function(){
				  		var src = this.getAttribute('data-src');
				  		idCounter++;

				  		console.log(this.nodeName);

						if(this.nodeName == 'IMG'){
							var obj = getImageSrc(src, idCounter);
					  		if(obj){
					  			childScripts.push(obj);
					  			this.style.position = 'absolute';
				  				this.setAttribute('src', obj.filepath);
				  			}
						}
				  	})

				  	$('[href]').each(function(){
				  		var src = this.getAttribute('href');
				  		var rel = this.getAttribute('rel');
				  		idCounter++;

				  		if(this.nodeName == 'LINK' && rel == 'stylesheet'){
				  			var obj = getCSSSrc(src);
				  			if(obj){
					  			childScripts.push(obj);
					  			this.setAttribute('href', obj.filepath);
				  			}
				  		}
				  		else{
				  			this.setAttribute('href', getDirectSrc(src));
				  		}
				  	})

				  	var scriptEl;

				  	scriptEl = window.document.createElement("link");
					scriptEl.rel = "stylesheet";
					scriptEl.href="/dist/archive.css";
					scriptEl.type="text/css";
					window.document.head.appendChild(scriptEl);


					scriptEl = window.document.createElement("script");
					scriptEl.src = "http://code.jquery.com/jquery.js";
					window.document.head.appendChild(scriptEl);
					
					scriptEl = window.document.createElement("script");
					scriptEl.src = "/dist/lib/jquery.textselectevent.js";
					window.document.head.appendChild(scriptEl);

					scriptEl = window.document.createElement("script");
					scriptEl.src = "/dist/lib/findAndReplaceDOMText.js";
					window.document.body.appendChild(scriptEl);

					scriptEl = window.document.createElement("script");
					scriptEl.innerHTML = `window.__CARDID__ = '${cardId}'`;
					window.document.body.appendChild(scriptEl);

					scriptEl = window.document.createElement("script");
					scriptEl.src = "/dist/lib/externalDocScript.js";
					window.document.body.appendChild(scriptEl);

					var html = window.document.documentElement.outerHTML;
					deferred.resolve({html, childScripts})
				}
				catch(e){
					console.log(e);
					logger.error(e);
					deferred.reject(e);
				}

			}
		})

		return deferred.promise;
	}

	return {
		extract
		, preprocess
		, getCSSSrc
		, getHTMLSrc
		, getImageSrc
		, getDirectSrc
	}
}

module.exports = extractWebPage;