import fetch from 'isomorphic-fetch';
import Q from 'q';

var credentials = 'include';
export function get(url){
	return Q(fetch(url, {credentials})).then(handle);
}

export function put(url, body){
	const method = 'put';
	return Q(fetch(url, {method, body, credentials})).then(handle);
}

export function post(url, body){
	console.log('post', url, body);
	const method = 'post';
	return Q(fetch(url, {
		method
		, headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
		, body: JSON.stringify(body)
		, credentials
	})).then(handle);
}

function handle(response){
	return response.json()
	.then(obj=>{
		if(response.status>=400){
			throw obj;
			return obj;
		}

		return obj;
	})
}