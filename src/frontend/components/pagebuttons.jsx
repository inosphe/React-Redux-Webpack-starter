import React from 'react';
import _ from 'lodash';
import classnames from 'classnames';

var stylesheet = require('./pagebuttons.scss');
class PageButtons extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'PageButtons';

        this.state = {
        	p: this.props.p
        }
    }

    render() {
    	var self = this;
    	function r(i){
            self.setState({p: i})
            self.props.onPage(i);
    	}

    	var num = Number(this.props.num);
    	var r0 = Math.max(this.state.p-num/2, 1)
    	  , r1 = r0 + num;

    	var prev;
    	if(r0 > 1){
    		prev = <button onClick={()=>r(this.state.p-1)}>p</button>
    	}
    	var buttons = _.map(_.range(r0, r1), i=>
            <button onClick={()=>r(i)} className={classnames({selected: i==this.state.p})}>{i}</button>)

        return <div className='pagebuttons'>
        	{prev}
        	{buttons}
        	<button onClick={()=>r(this.state.p+1)}>n</button>
        </div>;
    }
}

PageButtons.propTypes = {
	to: React.PropTypes.func.isRequired
	, p: React.PropTypes.number
	, num: React.PropTypes.number
};

PageButtons.defaultProps = { 
    p: 1
    , num: 10
};

export default PageButtons;
