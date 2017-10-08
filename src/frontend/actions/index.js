import { combineReducers } from 'redux';
import { reducer as config } from './config.decl'
import { reducer as account } from './account.decl'

import { routerReducer } from 'react-router-redux'

const rootReducer = combineReducers({
	router: routerReducer
	, global: combineReducers({
		config: config
	})
	, account
});

export default rootReducer;
