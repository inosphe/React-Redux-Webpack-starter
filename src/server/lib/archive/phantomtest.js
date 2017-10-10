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

function archive(url){
    try{
        var urlProcessor = require('./urlProcessor')('a', url);
        var pageProcessor = require('./pageProcessor')(urlProcessor);
    }
    catch(e){
        console.log(e, e.stack);
    }

    console.log('phantom', url);
    return phantom.create()
    .then(instance => {
        phInstance = instance;
        return instance.createPage();
    })
    .then(page => {
        sitepage = page;
        // return page.open('https://stackoverflow.com/');
        page.setting('resourceTimeout', 3000);
        page.setting('javascriptEnabled', true);
        page.setting('loadImages', false);
        page.on('onResourceRequested', function (requestData, networkRequest) {
            console.log(requestData.url);
            // networkRequest.abort();
        });
        page.on('onResourceReceived', function(response) {
            // console.log('Receive ' + JSON.stringify(response, undefined, 4));
            // console.log('R : ', response.status);
        });
        var process = require('process');
        page.on('onConsoleMessage', function(msg) {
            process.stdout.write(`console: ${msg}\n`);
        });
        return page.open(url)
        .then(timeout(1000))
        .then(()=>{
            return page.evaluate(function(pageProcessor){
                console.log('outerHTML', document.documentElement.outerHTML);
                return document.documentElement.outerHTML;
            })
            .then(content=>{
                page.render('test.pdf');
                return content;
            })
        })
    })
    // .then(status => {
    //     // console.log('document', sitepage.property('document'));
    //     return sitepage.property('content');
    // })
    .then(content => {
        sitepage.close();
        phInstance.exit();
        content =pageProcessor()
        return {html: content};
    })
    .catch(error => {
        console.log(error);
        phInstance.exit();
    });
}

module.exports = archive;