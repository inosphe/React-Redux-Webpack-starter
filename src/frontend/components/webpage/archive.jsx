import React from 'react';

import './archive.scss';

class Archive extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'Archive';

		this.state = {
		}
	}

    onLoadIframe(){
    }

	render() {
		return (
			<div className='component--archive'>
				<div className='iframe-container'>
					<iframe name='archive' ref='archive' 
		                src={`/webpage/${this.props.source._id}/a`} 
		                onLoad={this.onLoadIframe.bind(this)}
		            />
				</div>
			</div>
		)
	}
}

export default Archive;
