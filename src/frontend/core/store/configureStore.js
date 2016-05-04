import rootReducer from '../../actions';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { reduxReactRouter } from 'redux-router';
import { createHistory } from 'history';
import { devTools } from 'redux-devtools';
import _ from 'lodash';
import Immutable from 'immutable';

export function configureStore(initialState, routes){
	// Compose reduxReactRouter with other store enhancers
	var __initialState = _.extend(rootReducer(initialState, {type: '__INIT__'}));
	console.log('__initialState', __initialState);
	const store = compose(
	  applyMiddleware(thunkMiddleware),
	  reduxReactRouter({
	    routes,
	    createHistory
	  }),
	  devTools()
	)(createStore)(rootReducer, __initialState);

	return store;
}


