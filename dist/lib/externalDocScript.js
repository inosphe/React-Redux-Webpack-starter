window.addEventListener('load', function(){
	$(document).bind('textselect', function (evt, string, element) {
		if(!string || !string.length)
			return;

		var selection = document.getSelection();
		console.log('selection', selection);
		selection = preprocess(selection);
		console.log('selection_', selection);

		if(!validateSelection(selection)){
			alert('inversed');
			return;
		}
		
		var textlist = wrapElementFromSelection(selection);
		console.log(string);
		console.log(textlist);

		clearSelection();
		window.postMessage({type: 'create', text: textlist}, "*");

		return;



		// element = selection.anchorNode;
		// console.log('element', element, $(element).parent());
		// return;

		//var element2 = $(document.createElement(element.tagName));
		var element2 = $(document.createElement('span'));
		//element2 = $(element);
		//var element2 = $(element).clone();
		//element2.empty();

		console.log('element2', element2);
		
		element2.append($('<span>' + t0 + '</span>'));
		var e1 = $('<span></span>').css('background-color', 'blue').text(t1);
		element2.append(e1);
		element2.append($('<span>' + t2 + '</span>'));
		//element2.insertAfter(element);
		// element.remove();
		$(selection.anchorNode).replaceWith(element2);

	    if (string != "") alert('Selected text (' + element.tagName + '): ' + string);
	});
}, false)

var waiting = true;
window.addEventListener('message', function(e){
	var data = e.data;
	if(data && data.type == 'annotation'){
		makeAnnotation(data.items, data.offset);
		if(waiting){
			window.postMessage({type: 'render-complete'}, '*');
			waiting = false;
		}
	}
})

function makeAnnotation(items, offset){
	offset = offset || 0;
	var i = offset;
	items.forEach(function(obj){
		console.log(obj);
		obj.text.forEach(function(text){
			if(text.length<5){
				return;
			}

			window.findAndReplaceDOMText(document.querySelector('body'), {find: text, wrap: 'annotation'});
			
			$('annotation:not([id])').each(function(){
				var el = $(this).attr('id', 'a'+i);
			});
		});

		++i;
	});

	var length = i;
	var left_most = 2000;
	for(var i=0; i<length; ++i){
		$('annotation[id=a'+i+']').slice(0, 1).each(function(){
			var pos = $(this).offset();
			left_most = Math.min(left_most, pos.left);
			console.log(i, this, pos);
			var numObj = $('<div></div>').addClass('annotation-num').text(i).css({top: pos.top})
				.appendTo(document.body);
		})

		console.log('position', $('annotation[id=a'+i+']').offset());
	}

	$('.annotation-num').css({left: Math.max(left_most-40, 0)});
}

function wrapElementFromSelection(selection){
	// console.log('anchorNode', selection.anchorNode, selection.anchorOffset);
	// console.log('focusNode', selection.focusNode, selection.focusOffset);
	// console.log(selection.getRangeAt(0), selection.rangeCount);

	// console.log('rangeCount', selection.rangeCount);
	// for(var i=0; i<selection.rangeCount; ++i){
	// 	console.log('i', selection.getRangeAt(i).startContainer, selection.getRangeAt(i).endContainer);
	// }

	var textlist = [];

	if(selection.anchorNode==selection.focusNode && selection.anchorOffset == selection.focusOffset)
		return;
	//alert(t1.length);


	var iterator = createIterator(selection.anchorNode, selection.focusNode);
	var elem = iterator.elem();
	var i = 0;
	var elems = [];
	var newElems = [];

	var begin;
	while(true){
		if(elem == null || i>20){
			break;
		}

		var next;


		var text = $(elem).text();
		var _elem = elem;

		console.log('@', $(elem), text, elem.nodeType);
		var t0=null, t1, t2;

		var len = text.length;
		var p0=0, p1=0, p2=text.length;

		if(elem == selection.anchorNode)
			p1 = selection.anchorOffset;
		if(elem == selection.focusNode)
			p2 = selection.focusOffset;

		var _t0 = null
			, _t1 = text.substring(p1, p2)
			, _t2 = null

		t1 = $(document.createTextNode(_t1));
		_t1 = _t1.trim();
		if(_t1 && _t1.length){
			textlist.push(_t1);
		}
		if(elem == selection.anchorNode){
			_t0 = text.substring(p0, p1);
			t0 = $(document.createTextNode(_t0));
			begin = begin || t0;
		}
		if(elem == selection.focusNode){
			_t2 = text.substring(p2, len);
			t2 = $(document.createTextNode(_t2));
		}

		console.log('t0', _t0);
		console.log('t1', _t1);
		console.log('t2', _t2);

		var replaced = true;

		if(t0 && t2){
			next = iterator.next();
			$(elem).replaceWith(t0);
			t2.insertAfter(t0);
			// console.log('insertAfter', t0, t2);
		}
		else if(t0){
			next = iterator.next();
			$(elem).replaceWith(t0);

			console.log('t0', $(t0), $(begin));
		}
		else if(t2){
			next = iterator.next();
			$(elem).replaceWith(t2);
		}
		else{
			next = iterator.next();
			$(elem).replaceWith(begin); //very tricky opreation(can be replaced with <div/>)
		}

		console.log('#', $(elem), text, elem.nodeType, _elem==elem);

		var selectedNode;
		if(elem.nodeType == 3){
			selectedNode = $(document.createElement('amblock'));
			selectedNode.append(t1);
		}
		else{
			selectedNode = $(elem).clone();
		}

		// console.log('replaced', elem);

		// console.log('selectedNode', selectedNode);

		selectedNode.css('background-color', 'lightcyan');
		newElems.push(selectedNode);

		next = next===undefined?iterator.next():next;
		// console.log('will removed', elem);
		if(replaced)
			elem.remove();
		elem = next;

		++i;

	}

	console.log('begin', $(begin));
	console.log('newElems', newElems)
	var _last = begin;
	for(var i=0, l=newElems.length; i<l; ++i){
		var _e = newElems[i];
		_e.insertAfter(_last);
		_last = _e;
	}
	//$(elems).remove();
	return textlist;
}

function preprocess(selection){
	var anchorNode = selection.anchorNode;
	var anchorOffset = selection.anchorOffset;

	var focusNode = selection.focusNode;
	var focusOffset = selection.focusOffset;

	if(focusNode.nodeType == 1){
		focusNode = focusNode.childNodes[focusOffset];
		focusOffset = -1;
	}

	return {anchorNode, anchorOffset, focusNode, focusOffset}

}

function createIterator(elem, end){
	elem = $(elem);


	function next(){
		if(elem==null || elem[0] == end || elem.length == 0){
			console.log('end');
			elem = null;
			return elem;
		}

		if(child())
			return elem[0];
		

		return next2();
	}

	function next2(){
		var _next = $(elem[0].nextSibling);

		while(_next == null || _next.length==0){
			elem = elem.parent();
			// console.log('parent', elem);
			if(!elem.length){ //check root
				return null;
				console.log('end2');
			}

			_next = $(elem[0].nextSibling);
		}

		elem = _next;
		child();
		// console.log('next2#', elem[0]);
		return elem[0];
	}

	function child(){
		if(elem.contents() && elem.contents().length>0 && ($.contains(elem[0], $(end).parent()[0]) || elem[0]==$(end).parent()[0])){
			elem = elem.contents().first();
			
			return true;
		}

		return false;
	}

	return {
		elem: function(){return elem[0];}
		, next: next
		, set: function(v){elem = $(v);}
	}
}

function validateSelection(selection){
	if(selection.anchorNode == selection.focusNode && selection.anchorOffset > selection.focusOffset ){
		return false;
	}

	if($.contains(selection.focusNode, selection.anchorNode)){
		return true;
	}
	else if(isValidNodeOrder(selection.anchorNode, selection.focusNode)){
		return true;
	}
	else{
		return false;
	}
}

function isValidNodeOrder(anchorNode, focusNode){
	var iterator = createIterator(anchorNode, focusNode);
	var found = false;
	var elem = iterator.elem();
	while(elem){
		if(elem == focusNode){
			found = true;
		}
		elem = iterator.next()
	}

	return found;
}

// http://stackoverflow.com/questions/3169786/clear-text-selection-with-javascript
function clearSelection(){
	if (window.getSelection) {
		if (window.getSelection().empty) {  // Chrome
			window.getSelection().empty();
		} else if (window.getSelection().removeAllRanges) {  // Firefox
			window.getSelection().removeAllRanges();
		}
	} else if (document.selection) {  // IE?
		document.selection.empty();
	}
}