import React from 'react';
import { connect } from 'react-redux';

import List from 'components/list/list'
import DataSource from 'components/datasource'
import { post } from 'utils/request'

@connect((state) => {return {global: state.global}}, {})
class NoteListView extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'NoteListView';
	}

	AddNote(){
		post('/v1/note/create')
		.then(res=>{
			this.refs.datasource.fetch();
		})
	}

	render() {
		return (
			<div>
				<DataSource src={`/v1/note/list`} ref='datasource'>
					<List link={doc=>`/note/${doc._id}`} />
				</DataSource>
				<button onClick={()=>this.AddNote()}>Add Note</button>
			</div>
		)
	}
}

export default NoteListView;
