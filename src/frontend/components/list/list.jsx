import React from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import ListItem from './listitem'

class List extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'List';
    }

    delete(doc){
    	if(this.props.delete){
    		this.props.delete(doc);
    	}
    }

    transform(doc, i){
        let obj = {
            key: doc._id || '_'+i
            , className: this.props.itemClassName
            , title: doc.title || doc.name || doc._id || 'untitled'
            , source: doc
            , link: this.props.link?this.props.link(doc): undefined
        }

        if(this.props.transform){
            _.extend(obj, this.props.transform(doc));
        }

        return obj;
    }

    render() {
        var component = this.props.component || ListItem;

        return <div className={classnames('content__list', this.props.className)}>
        	{_.map(this.props.source, (doc, i)=>
                React.createElement(component, this.transform(doc, i))
            )}
        </div>;
    }
}

export default List;
