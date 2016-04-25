'use strict'

import { type } from './config.decl';
import _ from 'lodash'

export function setConfig(key, value){
	return function(dispatch, getState){
		let state = getState();
		if(state[key] != value){
			dispatch({
				type: type.SET_CONFIG
				, key
				, value
			});
		}
	}
}