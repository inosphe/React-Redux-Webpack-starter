'use strict'

import { type } from './config.decl';
import _ from 'lodash'
import { get } from 'utils/request'

export function queryDemoText(){
	console.log('queryDemoText')
	return function(dispatch, getState){
		get('v1/demo')
		.then(result => {
			console.log(result)
			dispatch({
				type: type.SET_CONFIG
				, key: 'demo_text'
				, value: result.text
			});
		})
	}
}