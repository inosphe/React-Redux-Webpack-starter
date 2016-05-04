'use strict'

import { type } from './config.decl';
import _ from 'lodash'
import { get } from './common'

export function queryDemoText(){
	return function(dispatch, getState){
		get('v1/demo')
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