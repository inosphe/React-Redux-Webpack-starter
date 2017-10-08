'use strict'

import _ from 'lodash'
import Immutable from 'immutable';

export class ActionGroup{
	constructor(defaultState){
		this.defaultState = defaultState || {};
		this.handlers = {};

		this._declare('__INIT__', (state, action)=>Immutable.fromJS(state));
	}

	_declare(action, callback){
		this.handlers[action] = callback;
	}

	declare(){
		var decl = this._declare.bind(this);
		decl.merge = function(action, callback){
			decl(action, (state, action)=>state.merge(callback(state, action)));
		}
		return decl;
	}

	getReducer(){
		var self = this;
		return (state = this.defaultState, action)=>{
			let reducer = this.handlers[action.type];
			if(reducer){
				return reducer(state, action);
			}
			else{
				return state;
			}
		}
	}

	getTypes(){
		return _.mapValues(this.handlers, (v,k)=>k);
	}
};
