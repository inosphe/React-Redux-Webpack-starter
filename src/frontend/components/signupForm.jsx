import React from 'react';

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'SignupForm';

        this.state = {
            email: ''
            , password: ''
            , password2: ''
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
        this.props.onSubmit(this.state);
    }

    render() {
        return <div>
            <div>{this.props.message || this.state.message}</div>
        	<div>
                email
                <input value={this.state.email} onChange={this.handleChange.bind(this, 'email')} onKeyDown={this.handleEnter.bind(this)} />
            </div>
            <div>
                password
                <input type='password' value={this.state.password} onChange={this.handleChange.bind(this, 'password')} onKeyDown={this.handleEnter.bind(this)} />
            </div>
            <div>
                password(confirm)
                <input type='password' value={this.state.password2} onChange={this.handleChange.bind(this, 'password2')} onKeyDown={this.handleEnter.bind(this)} />
            </div>
            <button onClick={this.handleSubmit.bind(this)}>Sign up</button>
        </div>;
    }
}

export default SignupForm;
