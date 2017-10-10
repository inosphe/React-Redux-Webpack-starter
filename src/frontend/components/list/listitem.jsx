import React from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

class ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'ListItem';
    }
    render() {
        console.log('this.props', this.props);

        let title = this.props.title;
        if(this.props.link){
            title = <Link to={this.props.link}>{title}</Link>
        }

        console.log('title', title)

        return <div className={classnames('content--item', this.props.className)}>
        	<div className='title'>
        		{title}
        	</div>
        </div>;
    }
}

export default ListItem;
