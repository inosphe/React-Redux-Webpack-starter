import React from 'react';
import * as request from 'utils/request';
import PageButtons from 'components/pagebuttons';
import classnames from 'classnames';

class DataSource extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'DataSource';
        this.state = {}
        if(props.paging){
            this.state.p = this.props.p || 1;
        }
    }

    componentDidMount() {
		this._fetch(this.props, this.state);
    }

    componentWillUpdate(nextProps, nextState) {
        if(this.props.src != nextProps.src){
            this._fetch(nextProps, nextState);
        }
        else if(this.state.p != nextState.p){
            this._fetch(nextProps, nextState);
        }
    }

    _fetch(props, state){
        console.log('_fetch', props);
        var src = props.src;
        if(this.state.p !== undefined){
            src = props.src(state.p);
        }

        console.log('src', src);
        var self = this;
        function transform(data){
            if(typeof self.props.transform == 'function'){
                return self.props.transform(data);
            }
            if(self.props.transform){
                return data[self.props.transform];
            }
            else{
                return data;
            }
        }

        if(src){
            request[props.type || 'get'](src, props.body)
            .then(res=>{
                this.setState({
                    data: transform(res)
                });
            })
            .fail(console.error)
        }
    }

    fetch(){
        this._fetch(this.props, this.state);
    }

    render() {
        if(!this.state.data)
            return <div />

        var paging;
        if(this.props.paging){
            paging = <PageButtons ref='paging' onPage={i=>this.setState({p: i})} />
        }

		const childrenWithProps = React.Children.map(this.props.children,
			(child) => React.cloneElement(child, {
                [this.props.propName] : this.state.data
                , fetch: this.fetch.bind(this)
			})
		);
        return <div className={classnames('datasource', this.props.className)}>
            {paging}
            {childrenWithProps}
        </div>;
    }
}

DataSource.propTypes = {};

DataSource.defaultProps = { 
    propName: 'source'
    , transform: undefined
};

export default DataSource;
