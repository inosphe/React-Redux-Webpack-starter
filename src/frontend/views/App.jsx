import React from 'react';
import TopMenu from './TopMenu';
import Main from './Main';
import Demo from './Demo';
import NoteListView from './noteListView';
import NoteView from './noteView';
import SignupPage from '../views/signupPage';
import SigninPage from '../views/signinPage';

import { withRouter } from 'react-router'
import { Switch, Route, Link } from 'react-router'
import { push } from 'react-router-redux'

import QueryString from 'utils/QueryString';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'App';
	}

	render() {
		var email;
		if(this.props.user){
			email = this.props.user.get('email');
		}
		return <div>
			<div>
				<div>pathname : {this.props.pathname}</div>
				<div>query : {JSON.stringify(this.props.q)}</div>
			</div>
			<div>
				user : {email}
			</div>
			
			<TopMenu push={this.props.push} />

			<Switch>
				<Route path="/main" component={Main} />
				<Route path="/demo" component={Demo} />
				<Route exact path="/note" component={NoteListView} />
				<Route path="/note/:_id" component={NoteView} />
				<Route path="/signup" component={SignupPage} />
				<Route path="/signin" component={SigninPage} />
				<Route component={Main} />
			</Switch>
		</div>
	}
}

// Elsewhere, in a component module...
import { connect } from 'react-redux';

export default withRouter(connect(
	// Use a selector to subscribe to state
	state => {
	    const { match, location, history } = state
	    let queryString = new QueryString(state.router.location.search)
	    let q = {}
	    _.each(queryString.keys(), k=>{
	    	let values = queryString.values(k);
	    	q[k] = values.length>1?values:values[0]
	    })

		return {
			pathname: state.router.location.pathname
			, q: q
			, global: state.global
			, user: state.account.get('user')
		}
	},

	// Use an action creator for navigation
	{ push } )(App));