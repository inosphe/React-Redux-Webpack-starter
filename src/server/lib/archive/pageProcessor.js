function pageProcessor(urlProcessor){
	return function(window){
		var document = window.document;
		
		var childScripts = [];

		function forEach(arr, itr){
			for(var i in arr){
				itr(arr[i]);
			}
		}

		//remove all scripts
		forEach(document.querySelectorAll('script'), function(el){
			if(el && el.parentNode){
				el.parentNode.removeChild(el);
			}
		})

		//replace src attributes for various elements
	  	forEach(document.querySelectorAll('[src]'), function(el){
	  		console.log('el', el);
	  		if(!el.getAttribute){
	  			console.log(el, el.nodeName, 'has not getAttribute')
	  			return;
	  		}

			var src = el.getAttribute('src');

			console.log(el.nodeName, src);

			if(el.nodeName == 'IMG'){
				var obj = urlProcessor.getResourceUrl(src, 'image');
		  		if(obj){
		  			childScripts.push(obj);
	  				el.setAttribute('src', obj.filepath);
	  				el.removeAttribute('srcset');
	  				el.removeAttribute('sizes');
	  			}
			}
			else if(el.nodeName == 'FRAME' || el.nodeName == 'IFRAME'){
				if(!src || !src.length){
					return;
				}
				var obj = urlProcessor.getHTMLUrl(src);
				if(obj){
					childScripts.push(obj);
					el.setAttribute('src', obj.filepath);
				}
			}
			else{
				el.setAttribute('src', urlProcessor.getDirectUrl(src));
			}
	  	})

	  	forEach(document.querySelectorAll('[href]'), function(el){
	  		if(!el.getAttribute){
	  			console.log(el, el.nodeName, 'has not getAttribute')
	  			return;
	  		}
	  		
	  		var src = el.getAttribute('href');
	  		var rel = el.getAttribute('rel');
	  		if(el.nodeName == 'LINK' && rel == 'stylesheet'){
	  			var obj = urlProcessor.getResourceUrl(src, 'css');
	  			if(obj){
		  			childScripts.push(obj);
		  			el.setAttribute('href', obj.filepath);
	  			}
	  		}
	  		else{
	  			el.setAttribute('href', urlProcessor.getDirectUrl(src));
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
		scriptEl.innerHTML = "window.__CARDID__ = '${cardId}'";
		window.document.body.appendChild(scriptEl);

		scriptEl = window.document.createElement("script");
		scriptEl.src = "/dist/frontend_embed.js";
		window.document.body.appendChild(scriptEl);

		scriptEl = window.document.createElement("script");
		scriptEl.src = "/dist/lib/externalDocScript.js";
		window.document.body.appendChild(scriptEl);

		var html = window.document.documentElement.outerHTML;
		return {html: html, childScripts: childScripts}
	}
}
	

module.exports = pageProcessor;