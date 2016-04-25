import React from 'react';
import { connect } from 'react-redux';

import { setConfig } from 'actions/config'
import { queryDemoText } from 'actions/demo'

var stylesheet = require('./Demo.scss');

@connect((state) => {return {global: state.global}}, {setConfig, queryDemoText})
class Demo extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'Demo';
	}

	onClick(){
		this.props.setConfig('demo_text', 'Demo Text')
	}

	onClick2(){
		this.props.queryDemoText();
	}

	render() {
		return (
			<div className={stylesheet.className}>
				<div>{stylesheet.className}</div>
				<button onClick={this.onClick.bind(this)}>Click</button>
				<button onClick={this.onClick2.bind(this)}>Click-server</button>
				{this.props.global.config.demo_text}
			</div>)
	}
}

export default Demo;
