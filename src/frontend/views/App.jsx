import React from 'react';
import Main from './Main';
import TopMenu from './TopMenu';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'App';
	}

	render() {
		console.log(this.props);
		var email;
		if(this.props.user){
			email = this.props.user.get('email');
		}
		return <div>
			<div>
				<div>pathname : {this.props.pathname}</div>
				<div>query : {this.props.q}</div>
			</div>
			<div>
				user : {email}
			</div>
			
			<TopMenu pushState={this.props.pushState} />

			{this.props.children || <Main />}
		</div>
	}
}

// Elsewhere, in a component module...
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

export default connect(
	// Use a selector to subscribe to state
	state => {
		return {
			pathname: state.router.location.pathname
			, q: state.router.location.query.q
			, global: state.global
			, user: state.account.get('user')
		}
	},

	// Use an action creator for navigation
	{ pushState } )(App);