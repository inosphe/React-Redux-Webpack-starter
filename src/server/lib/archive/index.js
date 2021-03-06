var fs = require('fs');
var Q = require('q');
var _extractWebPage = require('lib/_extractWebPage');
var urllib = require('url');
var path = require('path');
var request = require('request');
var mapSeries = require('promise-map-series');
var jsdom = require("jsdom/lib/old-api.js");

//native functions (promise);
var mkdir = Q.denodeify(fs.mkdir);
var mkdirp = Q.denodeify(require('mkdirp'));
var open = Q.denodeify(fs.open);
var write = Q.denodeify(fs.write);
var stats = Q.denodeify(fs.stat);
var rmdir = Q.denodeify(require('rmdir'));

var phantomRequest = require('./phantomRequest');
var pageProcessor = require('./pageProcessor');
var urlProcessor = require('./urlProcessor');

var replaceStream = require('replacestream')

var requestOpt = {
	headers: {
		'Connection': 'keep-alive'
		, 'Accept-Encoding': 'gzip, deflate, sdch'
		// , 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0"
		, 'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36"
		, 'Cache-Control': "max-age=0"
	}
	, method: 'GET'
	, timeout: 3500
	, gzip: true
}

function crawl(url, cardId, force_truncate){
	var rootDir = `data/archive/${cardId}`;

	return checkDirectory(rootDir, force_truncate)
	.then(()=>crawlWebPage(url, cardId, rootDir, `/webpage/${cardId}/a`))
	.then(()=>console.log(url, 'all complete'));
}

function crawlWebPage(url, cardId, dirname, routePath){
	console.log('crawlWebPage', url, cardId, dirname, routePath);
	var urlObj = urllib.parse(url);
	var _urlProcessor = urlProcessor(routePath, url)

	return mkdir(dirname)
	.then(res=>{
		console.log(dirname, 'is made.', res);

		return phantomRequest(url)
		.catch(()=>url)
		.then(html=>{
			var defer = Q.defer();
			jsdom.env(
				html
				, ["http://code.jquery.com/jquery.js"]
				, function (errors, window) {
					try{
						defer.resolve(pageProcessor(_urlProcessor)(window));
					}
					catch(e){
						console.error('error - jsdom');
						defer.reject(e);
					}
				}
			);
			return defer.promise;
		})
	})
	.then(extraction=>{
		logger.log('extraction', extraction)
		console.log('dirname', dirname);
		return open(path.resolve(dirname, 'index.html'), 'w+')
		.then(fd=>write(fd, extraction.html))
		.then(()=>{
			var childScripts = filter(extraction.childScripts);
			var groupByType = _.groupBy(childScripts, obj=>obj.type=='html'?1:0);
			
			return requestChildScripts(routePath, dirname, groupByType[0])
			.then(()=>groupByType[1]);
		})
	})
	.then(htmlScripts=>{
		logger.log('htmlScripts', htmlScripts);
		if(htmlScripts && htmlScripts.length){
			return Q.all(_.map(htmlScripts, obj=>{
				if(/^http/.exec(obj.url)){
					return crawlWebPage(obj.url, cardId, dirname+'/'+obj.dirname, undefined)
					.fail(err=>console.error(err))
				}
			}))
		}
	})
}

function filter(childScripts){
	var test = {};
	return _.filter(childScripts, obj=>{
		if(test[obj.url]){
			return false;
		}
		else{
			test[obj.url] = true;
			return true;
		}
	})
}

function requestChildScripts(routePath, dirname, childScripts){
	var requestAndStore = makeRequest(routePath, dirname);

	var parsed = _.map(childScripts, obj=>{
		obj.url = urllib.parse(obj.url);
		return obj;
	});

	var groupByHostname = _.groupBy(parsed, obj=>obj.url.hostname||obj.url.host);

	console.log('groupByHostname', groupByHostname);

	return Q.all(_.map(groupByHostname, (items, hostname)=>{
		return mapSeries(items, (obj)=>{
			obj.url = urllib.format(obj.url);
			return requestAndStore(obj)
			.then(nestedScriptUrlObjs=>{
				console.log('nestedScriptUrlObjs', nestedScriptUrlObjs);
				if(nestedScriptUrlObjs && nestedScriptUrlObjs.length){
					return mapSeries(nestedScriptUrlObjs, (nestedObj)=>{
						nestedObj.url = urllib.format(nestedObj.url);
						return requestAndStore(nestedObj)
					})
				}
			})
		})
		.then(()=>console.log(hostname, 'complete'))
	}))
	.then(()=>{
		console.log(dirname, 'complete');
	})
	.fail(err=>logger.error(err));
}


function makeRequest(routePath, dirname){
	return function(obj){
		var type = obj.type;
		var url = obj.url;

		var url_pathname = urllib.parse(url).pathname;
		url_pathname = url_pathname.replace(/^\/?\.\./, '');
		var f_dirname = path.dirname(url_pathname);
		if(f_dirname[0]=='/')
			f_dirname = '.' + f_dirname;

		console.log(url_pathname, f_dirname);
		
		var f_filename = path.basename(url_pathname);
		var f_ext = path.extname(url_pathname)

		if(obj.filename){
			f_filename = obj.filename;
		}

		var matched = f_filename.match(/^(.*?)\?/);
		if(matched){
			f_filename = matched[1] || f_filename;
		}
		var absoluteDirPath = path.resolve(process.cwd(), dirname, f_dirname);
		var absoluteFilePath = path.resolve(absoluteDirPath, f_filename);


		return mkdirp(absoluteDirPath)
		.then(()=>{
			return req()
		})

		function req(count){
			count = count || 0;

			var t0 = new Date();
			function logElapsed(){
				var t1 = new Date();
				console.log(url, absoluteFilePath, new Date(t1-t0).getMilliseconds()+'ms');
			}

			var defer = Q.defer();

			if(count>2){
				url = url.replace(/:\d+/, '');
				console.log('port removed', url);
			}

			var opt = {url: url};
			console.log('f_ext', f_ext)
			if(f_ext == '.jpg' || f_ext == '.png' || f_ext == '.gif'){
				opt.encoding = 'binary';
			}

			opt = _.extend(opt, requestOpt);

			let nestedScripts = []

			try{
				var readable = request(opt);
				var writable = fs.createWriteStream(absoluteFilePath);
				writable.on('finish', ()=>{
					logElapsed(); 
					defer.resolve(nestedScripts);
				})
				readable.on('error', e=>{defer.reject(e);})
				writable.on('error', e=>{defer.reject(e);})

				console.log('pipe into replacestream')

				let pipe_end = readable;
				if(opt.encoding != 'binary'){
					pipe_end = pipe_end.pipe(replaceStream(/@import url\(\"(.*?)\"\)/, (match, url)=>{
						let _urlProcessor = urlProcessor(routePath, obj.url);
						let replacedUrlObj = _urlProcessor.getResourceUrl(url, 'css');
						nestedScripts.push(replacedUrlObj);
						console.log('replacedUrlObj', url, replacedUrlObj)
						return `@import url("${replacedUrlObj.filepath}")`;
					}))
				}
				pipe_end = pipe_end.pipe(writable);
			}
			catch(e){
				defer.reject(e);
			}

			return defer.promise
			.fail(err=>{
				if(count<4){
					console.error(err);
					console.log(`retry : ${url} [${count}/5]`);
					return req(count+1);
				}
			})
		}
	}
}

function checkDirectory(dirname, force_truncate){
	var fullpath = path.resolve(process.cwd(), dirname);

	return stats(dirname)
	.then(stat=>{
		if(stat){
			if(stat.isDirectory()){
				if(force_truncate){
					console.log('rm -r', fullpath);
					return rmdir(fullpath)
					.then(res=>{
						console.log('deleted');
						console.log(res[0]);
						console.log(res[1]);
					})
				}
			}
			else{
				logger.error("It's not directory.");
				return;
			}
		}
		return Q({});
	})
	.fail(()=>{})
}


module.exports = crawl;