import React from 'react';
import { connect } from 'react-redux';

import DataSource from 'components/datasource'
import { post } from 'utils/request'

import Note from 'components/note/note'

@connect((state) => {return {global: state.global}}, {})
class NoteView extends React.Component {
	constructor(props) {
		super(props);
		this.displayName = 'NoteListView';
	}

	render() {
		console.log(this.props)

		let _id = this.props._id || this.props.match.params._id;

		return (
			<div>
				{_id}
				<DataSource src={`/v1/note/${_id}`}>
					<Note />
				</DataSource>
			</div>
		)
	}
}

export default NoteView;
