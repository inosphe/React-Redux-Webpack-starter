module.exports = function(arr, itr){
	var object = {};
	_.each(arr, (v, k)=>{
		itr(v, k, function(k, v){
			object[k] = v;
		});
	})
	return object;
}