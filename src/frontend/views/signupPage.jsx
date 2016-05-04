import React from 'react';
import { connect } from 'react-redux';
import SignupForm from 'components/signupForm'
import { signup } from 'actions/account'

@connect((state) => {return {account: state.account}}, {signup})
class SignupPage extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SignupPage';
    }
    render() {
        return <div>
        	{this.props.account.get('__failureMessage')}
        	
        	<SignupForm onSubmit={this.props.signup}/>
        </div>;
    }
}

export default SignupPage;
