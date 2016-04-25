import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from './store/configureStore'
import { ReduxRouter } from 'redux-router';
import ReactDOM from 'react-dom';
import routes from './routes'
import devtools from './devtools';

let store = configureStore(window.__INITIALSTATE__, routes);

global.store = store;

ReactDOM.render(
	<div>
		<Provider store={store}>
			<ReduxRouter>
	            {routes}
	          </ReduxRouter>
		</Provider>
    </div>
	, document.getElementById('root')
);

if (process.env.NODE_ENV !== 'production') {
  devtools(store);
}