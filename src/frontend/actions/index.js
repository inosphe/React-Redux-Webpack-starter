import { combineReducers } from 'redux';
import { routerStateReducer } from 'redux-router';
import { reducer as config } from './config.decl'
import { reducer as account } from './account.decl'

const rootReducer = combineReducers({
	router: routerStateReducer
	, global: combineReducers({
		config: config
	})
	, account
});

export default rootReducer;
