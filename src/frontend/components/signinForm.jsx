import React from 'react';

class SigninForm extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SigninForm';
        this.state = {
        	email: ''
        	, password: ''
        }
    }

    handleChange(stateName, e){
        this.setState({[stateName]: e.target.value});
    }

    handleEnter(e){
    	const ENTER = 13;
        if( e.keyCode == ENTER ) {
        	this.handleSubmit();
            e.preventDefault();
            e.stopPropagation();
        }
    }

    handleSubmit(){
    	if(this.props.onSubmit)
            this.props.onSubmit(this.state);
    }

    render() {
        return <div>
        	<div>
                email
            	<input value={this.state.email} onChange={this.handleChange.bind(this, 'email')} onKeyDown={this.handleEnter.bind(this)} />
            </div>
            <div>
            	password
            	<input type='password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleEnter.bind(this)} />
            </div>
            <button onClick={this.handleSubmit.bind(this)}>Sign in</button>
        </div>;
    }
}

export default SigninForm;
