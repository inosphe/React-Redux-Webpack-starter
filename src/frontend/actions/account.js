'use strict'

import { type } from './account.decl';
import _ from 'lodash'
import { get, post } from 'utils/request';
import { validateSignup, validateSignin } from 'validateAccount';
import { push } from 'react-router-redux'

export function signup(data){
	try{
		validateSignup(data);
	}
	catch(obj){
		return {type: type.SIGNUP_FAILURE, message: obj.message};
	}

	return function(dispatch, getState){
		post('/v1/account/signup', data)
		.then(res=>{
			console.log('signup response');
			console.log(res);
			return res;
		})
		.then(res=>dispatch({type: type.LOGIN_SUCCESS, user: res.user}))
		.then(()=>dispatch(push('/')))
		.fail(res=>{
			console.log('failure', res, res.message, res.stack);
			dispatch({type: type.SIGNUP_FAILURE, message: res.message})
		})
	}
}

export function signin(data){
	console.log('signin', data);
	console.log('validateSignin', validateSignin);
	try{
		validateSignin(data);
	}
	catch(obj){
		return {type: type.LOGIN_FAILURE, message: obj.message};
	}

	return function(dispatch, getState){
		post('/v1/account/signin', data)
		.then(res=>dispatch({type: type.LOGIN_SUCCESS, user: res.user}))
		.then(()=>dispatch(push('/')))
		.fail(res=>{
			console.log('failure', res, res.message, res.stack);
			dispatch({type: type.LOGIN_FAILURE, message: res.message})
		})
	}
}

export function logout(){
	return function(dispatch, getState){
		get('/v1/account/logout')
		.then(res=>{
			dispatch({type: type.LOGOUT, user: res.user})
		})
		.fail(console.error)
	}
}