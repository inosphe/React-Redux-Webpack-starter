import { ActionGroup } from './common.js'
import _ from 'lodash'

let group = new ActionGroup({
	loggedIn: false
	, user: null
});
let DECL = group.declare();

//SIGNUP_SUCCESS redirected to LOGIN_SUCCESS

DECL.merge('SIGNUP_FAILURE', (state, action)=>{
	return {
		loggedIn: false
		, user: null
		, __failureMessage: action.message
	}
})

DECL.merge('LOGIN_SUCCESS', (state, action)=>{
	return {
		loggedIn: true
		, user: action.user
		, __failureMessage: ''
	}
});

DECL.merge('LOGIN_FAILURE', (state, action)=>{
	return {
		loggedIn: false
		, user: null
		, __failureMessage: action.message
	}
})

DECL.merge('LOGOUT', (state, action)=>{
	return {
		loggedIn: action.user!=null
		, user: action.user
		, __failureMessage: ''
	}
})

export const reducer = group.getReducer();
export const type = group.getTypes();