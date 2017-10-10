import React from 'react';
import { put } from 'utils/request'

import WebPageArchive from 'components/webpage/archive'
import DataSource from 'components/datasource'

import NoteCellType from 'common/constants/noteCellType';
import EmbeddingType from 'common/constants/embeddingType';

class Note extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'Note';

		this.state = {
			input_url: ''
		}
	}

	addUrl(url){
		console.log(this.state)
		console.log('addUrl', url)
		put(`/v1/note/${this.props.source._id}/add`, {
			url
		})
		.then(()=>this.props.fetch())
	}

	render() {
		let contents = _.map(this.props.source.contents, content=>{
			console.log(content)
			if(content.type == NoteCellType.WebPage && content.embed){
				return <DataSource src={`/v1/webpage/${content.embed._id}`}>
					<WebPageArchive />
				</DataSource>
			}
			else{
				return <div>{`Invalid note cell type(${content.type})`}</div>
			}
		})


		return (
			<div>
				<div>{this.props.source._id}</div>
				<div>{this.props.source.title}</div>

				<div>{contents}</div>

				<div>
					<input 
						value={this.state.input_url} 
						onChange={e=>this.setState({input_url: e.target.value})} 
						onKeyDown={e=>onEnter(e, ()=>this.addUrl(this.state.input_url))}
					/>
				</div>
			</div>
		)
	}
}

export default Note;

function onEnter(e, cb){
	const ENTER = 13;
    if( e.keyCode == ENTER ) {
        e.preventDefault();
        e.stopPropagation();

        cb()
    }
}