import { ActionGroup } from './common.js'
import _ from 'lodash'

let group = new ActionGroup();
let DECL = group.declare();

DECL.merge('SET_CONFIG', (state, action)=>{
	return {[action.key]: action.value}
});

export const reducer = group.getReducer();
export const type = group.getTypes();