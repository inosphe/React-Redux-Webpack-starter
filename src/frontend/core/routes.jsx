import React from 'react';
import { Route } from 'react-router';

import App from '../views/App';
import Main from '../views/Main';
import Demo from '../views/Demo';
import SignupPage from '../views/signupPage';
import SigninPage from '../views/signinPage';

const routes = (
  <Route path="/" component={App}>
  	<Route path="/main" component={Main} />
  	<Route path="/demo" component={Demo} />
  	<Route path="/signup" component={SignupPage} />
  	<Route path="/signin" component={SigninPage} />
  </Route>
);

export default routes;