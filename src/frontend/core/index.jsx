import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore'
import ReactDOM from 'react-dom';
import App from '../views/App';

import createHistory from 'history/createBrowserHistory'
import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'


const history = createHistory()

let store = configureStore(window.__INITIALSTATE__, history);

global.store = store;

let render = (AppComponent)=>{
	ReactDOM.render(
		<div>
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<AppComponent />
				</ConnectedRouter>
			</Provider>
	    </div>
		, document.getElementById('root')
	);
}

render(App);

if (module.hot) {
	module.hot.accept('../views/App', () => {
		render(require('../views/App').default);
	})
}

if (process.env.NODE_ENV == 'development') {
	window.showDevTools = () => {
	    require('../utils/debug/createDevToolsWindow').default(store);		
	};
	// showDevTools();
}