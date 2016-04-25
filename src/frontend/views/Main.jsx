import React from 'react';

class Main extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'Main';
    }

    render() {
        return <div>
          main
          <img src={require('./logo-react.png')} />
        </div>
    }
}

import { connect } from 'react-redux';
export default connect(state => ({}), {})(Main);