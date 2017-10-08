import rootReducer from '../../actions';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import DevTools from '../../views/devTools';
import _ from 'lodash';
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

export function configureStore(initialState, history){
	// Compose reduxReactRouter with other store enhancers
	var __initialState = _.extend(rootReducer(initialState, {type: '__INIT__'}));
	// Build the middleware for intercepting and dispatching navigation actions
	const routerMiddleware_ = routerMiddleware(history)
	console.log('__initialState', __initialState);
	const store = compose(
		applyMiddleware(thunkMiddleware)
		, applyMiddleware(routerMiddleware_)
		, DevTools.instrument()
	)(createStore)(rootReducer, __initialState);


	if (module.hot) {
		module.hot.accept('../../actions', () =>
			store.replaceReducer(require('../../actions').default)
		);
	}

	return store;
}


