import React from 'react';
import { connect } from 'react-redux';
import { logout } from 'actions/account'

@connect((state) => {return {account: state.account}}, {logout})
class TopMenu extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'TopMenu';
    }
	route(url){
		this.props.pushState({}, url);
	}
    render() {
    	var onLogin;
        console.log(this.props.account.toJS());
    	if(!this.props.account.get('loggedIn')){
            onLogin = <group>
                <button onClick={this.route.bind(this, 'signup')}>signup</button>
                <button onClick={this.route.bind(this, 'signin')}>signin</button>
            </group>
    	}
    	else{
            onLogin = <button onClick={this.props.logout}>logout</button>;
    	}
        return <div>
        	<button onClick={this.route.bind(this, 'main')}>main</button>
			<button onClick={this.route.bind(this, 'demo')}>demo</button>
			{onLogin}
        </div>;
    }
}

export default TopMenu;
