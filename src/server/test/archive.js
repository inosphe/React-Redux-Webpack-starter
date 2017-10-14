var urlProcessor = require('lib/archive/urlProcessor');
var urllib = require('url');

module.exports = function(){
	// test1();
	// test2();
	// test3();
	// test4();
	// test5();
	test6();
}

function test1(){
	var url = 'http://www.host.com/route0/route1/route2';
	var extractor = urlProcessor('a', url, 'cardId');

	var src0 = '../image.png';
	var src1 = '/image.png';
	var src2 = 'image.png';

	var v0 = extractor.getResourceUrl(src0);
	var v1 = extractor.getResourceUrl(src1);
	var v2 = extractor.getResourceUrl(src2);

	console.log('test1');
	console.log('extract from', url);
	expect_EQ(extractor.preprocess(src0), 'http://www.host.com/route0/image.png');
	expect_EQ(v0.url, 'http://www.host.com/route0/image.png');
	expect_EQ(v1.url, 'http://www.host.com/image.png');
	expect_EQ(v2.url, 'http://www.host.com/route0/route1/image.png');

	expect_EQ(v0.filepath, 'a/route0/image.png');
	expect_EQ(v1.filepath, 'a/image.png');
	expect_EQ(v2.filepath, 'a/route0/route1/image.png');
}

function test2(){
	var url = 'http://www.host.com/route0/route1/route2/';
	var extractor = urlProcessor('a', url, 'cardId');

	var src0 = '../image.png';
	var src1 = '/image.png';
	var src2 = 'image.png';

	var v0 = extractor.getResourceUrl(src0);
	var v1 = extractor.getResourceUrl(src1);
	var v2 = extractor.getResourceUrl(src2);

	console.log('test2');
	console.log('extract from', url);
	expect_EQ(extractor.preprocess(src0), 'http://www.host.com/route0/route1/image.png');
	expect_EQ(v0.url, 'http://www.host.com/route0/route1/image.png');
	expect_EQ(v1.url, 'http://www.host.com/image.png');
	expect_EQ(v2.url, 'http://www.host.com/route0/route1/route2/image.png');

	expect_EQ(v0.filepath, 'a/route0/route1/image.png');
	expect_EQ(v1.filepath, 'a/image.png');
	expect_EQ(v2.filepath, 'a/route0/route1/route2/image.png');
}

function test3(){
	var url = `https://brunch.co.kr/@alden/25`;
	var extractor = urlProcessor('a', url, 'cardId');

	var src = `//t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png`;

	console.log('test3');
	var v = extractor.getResourceUrl(src, 0);
	expect_EQ(extractor.preprocess(src), 'http://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png');
	expect_EQ(v.url, 'http://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png');
	expect_EQ(v.filepath, 'thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png');
	expect_EQ(v.filepath, 'a/thumb/R1280x0img0');
}

function test4(){
	var url = `https://brunch.co.kr/@alden/25`;
	var extractor = urlProcessor('a', url, 'cardId');

	var src = `//t1.daumcdn.net/thumb/img.png?query=q`;

	console.log('test4');
	var v = extractor.getResourceUrl(src, 0);
	expect_EQ(extractor.preprocess(src), 'http://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png');
	expect_EQ(v.url, 'http://t1.daumcdn.net/thumb/R1280x0/?fname=http://t1.daumcdn.net/brunch/service/user/3Y0/image/eoSjCGSa5fj1oy8H6bsrDnG3N1I.png');
	expect_EQ(v.filepath, 'a/thumb/img0.png');
}

function test5(){
	var url = `http://www.willforfang.com/computer-vision/2016/4/9/artificial-intelligence-for-handwritten-mathematical-expression-evaluation`;
	var extractor = urlProcessor('a', url, 'cardId');

	var src = `http://static1.squarespace.com/static/sitecss/51d065aae4b02b756741c0cb/136/4fb6ba24e4b000ba644d8298/51d108aae4b0d032675adb95/444-05142015/1463374414385/site.css?&filterFeatures=false`;

	console.log('test5');
	var v = extractor.getResourceUrl(src, 0);
	expect_EQ(v.filepath, 'a/static/sitecss/51d065aae4b02b756741c0cb/136/4fb6ba24e4b000ba644d8298/51d108aae4b0d032675adb95/444-05142015/1463374414385/site0.css');
}

function test6(){
	var url = `http://www.yonhapnews.co.kr/bulletin/2017/02/05/0200000000AKR20170205002900075.HTML`
	var src = `http://img.yonhapnews.co.kr/basic/svc/14_images/css/common2015.v1.css`;
	var extractor = urlProcessor('a', url, 'cardId');
	console.log(extractor.getResourceUrl(src, 0))
}

function expect_EQ(v0, v1){
	var desc = `${v0} == ${v1}`;
	var value = v0===v1;
	
	if(value){
		console.log('[SUCCEED]', desc);
	}
	else{
		console.error('[FAILED]', desc);
	}
}

