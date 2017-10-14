import unique from 'unique-selector';
window.unique = unique;
window.addScript = function( src ) {
	var s = document.createElement( 'script' );
	s.setAttribute( 'src', src );
	document.body.appendChild( s );
}

$('div, p').on('mouseover mouseout', function(e) {
    $(this).toggleClass('hovering', e.type === 'mouseover');
    e.stopPropagation();
});

$('div, p').on('click', function(e) {
	var query = unique(this);
	console.log(this, this.innerHTML, query)
    window.postMessage({type: 'element', element: this.innerHTML, query: query}, "*");
    e.stopPropagation();
});