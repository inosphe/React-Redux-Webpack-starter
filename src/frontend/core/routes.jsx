import React from 'react';
import { Route } from 'react-router';

import App from '../views/App';
import Main from '../views/Main';
import Demo from '../views/Demo';

const routes = (
  <Route path="/" component={App}>
  	<Route path="/main" component={Main} />
  	<Route path="/demo" component={Demo} />
  </Route>
);

export default routes;