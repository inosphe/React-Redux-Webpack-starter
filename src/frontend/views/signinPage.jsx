import React from 'react';
import { connect } from 'react-redux';
import SigninForm from 'components/signinForm'
import { signin } from 'actions/account'

@connect((state) => {return {account: state.account}}, {signin})
class SigninPage extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SigninPage';
    }
    render() {
        return <div>
        	{this.props.account.get('__failureMessage')}
        	
        	<SigninForm onSubmit={this.props.signin}/>
        </div>;
    }
}

export default SigninPage;
