import React from 'react';

import Main from './Main';

class App extends React.Component {
		constructor(props) {
				super(props);
				this.displayName = 'App';
		}

		route(url){
			this.props.pushState({}, url);
		}

		render() {
			console.log(this.props);
			return <div>
				<div>
					<div>pathname : {this.props.pathname}</div>
					<div>query : {this.props.q}</div>
				</div>
				<button onClick={this.route.bind(this, 'main')}>main</button>
				<button onClick={this.route.bind(this, 'demo')}>demo</button>

				{this.props.children || <Main />}
			</div>
		}
}

// Elsewhere, in a component module...
import { connect } from 'react-redux';
import { pushState } from 'redux-router';

export default connect(
	// Use a selector to subscribe to state
	state => {return {pathname: state.router.location.pathname, q: state.router.location.query.q, global: state.global}},

	// Use an action creator for navigation
	{ pushState }
)(App);