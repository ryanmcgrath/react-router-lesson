import React from 'react';
import store from '../store/store';
import {addUser, loadRepository} from '../store/actions';
import CommitMessage from './commit-message';

class RepositoryIndex extends React.Component {
    constructor(props) {
        super(props);
        this.state = {history: []};
        this.updateRepo = this.updateRepo.bind(this);
    }

    componentDidMount() {
        store.dispatch(addUser(this.props.params.username));
        this.unsubscribe = store.subscribe(this.updateRepo);
        store.dispatch(loadRepository(this.props.params.username, this.props.params.repository));
    }

    componentWillReceiveProps(newProps) {
        store.dispatch(loadRepository(newProps.params.username, newProps.params.repository));
    }

    componentWillUnmount() {
        this.unsubscribe();
    }

    updateRepo(history) {
        let data = store.getState()[this.props.params.username];
        if(data[this.props.params.repository])
            data = data[this.props.params.repository];
        else
            data = [];

        this.setState({history: [].concat(data)});
    }

    render() {
        return <ul className="repository">
            <h1>Showing Recent Commits on {this.props.params.username}/{this.props.params.repository}</h1>
            {this.state.history.map(function(commit, i) {
                return <CommitMessage commit={commit} key={i} />;
            })}
        </ul>;
    }
};

export default RepositoryIndex;
