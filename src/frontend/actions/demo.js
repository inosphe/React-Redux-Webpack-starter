'use strict'

import { type } from './config.decl';
import _ from 'lodash'
import es6promise from 'es6-promise';
import fetch from 'isomorphic-fetch'

es6promise.polyfill();

export function queryDemoText(){
	return function(dispatch, getState){
		fetch('v1/demo')
		.then(response => response.json())
		.then(result => {
			dispatch({
				type: type.SET_CONFIG
				, key: 'demo_text'
				, value: result.text
			});
		})
	}
}