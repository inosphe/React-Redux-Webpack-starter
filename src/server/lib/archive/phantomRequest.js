var Q = require('q');

var phantom = require('phantom');

var sitepage = null;
var phInstance = null;

function timeout(t){
    var defer = Q.defer();

    return function(res){
        setTimeout(()=>defer.resolve(res), t);
        return defer.promise;
    }
}

var customHeaders = {
    'User-Agent': "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11; rv:46.0) Gecko/20100101 Firefox/46.0"
};

function RequestWebpage(url){
    return phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        // This is how you set other header variables

        sitepage = page;
        page.on('onResourceRequested', function (requestData, networkRequest) {
            console.log(requestData.url);
            console.log(requestData);
            // networkRequest.abort();
        });
        page.on('onResourceReceived', function(response) {
            // console.log('Receive ' + JSON.stringify(response, undefined, 4));
            // console.log('R : ', response.status);
            if(response.redirectURL){
                console.log('Receive ' + JSON.stringify(response, undefined, 4));
                console.log('R : ', response.status);
                console.log('redirectURL : ', response.redirectURL);
            }
        });


        var process = require('process');
        page.on('onConsoleMessage', function(msg) {
            process.stdout.write(`console: ${msg}\n`);
        });

        page.on('onResourceError', function(resourceError) {
            console.error('= onResourceError()');
            console.error('  - unable to load url: "' + resourceError.url + '"');
            console.error('  - error code: ' + resourceError.errorCode + ', description: ' + resourceError.errorString );
        });

        page.on('onError', function(msg, trace) {
            console.error('= onError()');
            var msgStack = ['  ERROR: ' + msg];
            if (trace) {
                msgStack.push('  TRACE:');
                trace.forEach(function(t) {
                    msgStack.push('    -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
                });
            }
            console.error(msgStack.join('\n'));
        });

        page.on('onNavigationRequested', function(_url, type, willNavigate, main) {
            console.log("redirect caught", {main, type, _url, url})
            if (main && _url!=url) {
                myurl = _url;
                page.close()
            }
        });

        page.on('onUrlChanged', function(targetUrl) {
            console.log('New URL: ' + targetUrl);
        });

        page.on('onLoadStarted', function() {
            console.log('onLoadStarted', arguments);
            page.evaluate(function() {
                return window.location.href;
            })
            .then(currentUrl=>console.log('currentUrl', currentUrl));
        });




        return Q.all([
            , page.property('customHeaders', customHeaders)
            // ,return page.open('https://stackoverflow.com/')
            , page.setting('resourceTimeout', 3000)
            , page.setting('javascriptEnabled', true)
            , page.setting('loadImages', false)
            , page.setting('navigationLocked', true)
        ])
    })
    .then(()=>{
        var page = sitepage;

        var defer = Q.defer();
        page.on('onLoadFinished', function(status){
            console.log('phantom Status: ' + status);
            if(status == 'fail'){
                console.log(arguments);
                defer.reject(status);
            }
            else{
                defer.resolve(status);
            }
        })

        return page.open(url)
        .then(()=>{
            return defer.promise;
        })
        .then(timeout(2000))
        .then(()=>{
            return page.evaluate(function(){
                return document.documentElement.outerHTML;
            })
        })
    })
    // .then(status => {
    //     // console.log('document', sitepage.property('document'));
    //     return sitepage.property('content');
    // })
    .then(content => {
        console.log('phantom close');
        // console.log(content);
        sitepage.close();
        phInstance.exit();
        return content;
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
}

module.exports = RequestWebpage;