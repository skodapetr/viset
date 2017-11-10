import React from "react";
import {Link} from "react-router";
import {connect} from "react-redux";
import {fetchExecutionList, clearExecutionList} from "./../execution-action";
import {ExecutionListComponent} from "./execution-list";
import {selectListLoading, selectListData} from "./../execution-reducer";

class ExecutionListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const {loading, executions} = this.props;
        // TODO Extract HTML into another component and made this pure container.
        return (
            <div>
                <ExecutionListComponent isLoading={loading}
                                        executions={executions}/>
                <br/>
                <Link to={"/execution/create"}>Create new execution</Link>
            </div>
        )
    }

    componentWillUnmount() {
        this.props.clearData();
    }

}

const mapStateToProps = (state, ownProps) => ({
    "loading": selectListLoading(state),
    "executions": selectListData(state)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "fetchData": () => dispatch(fetchExecutionList()),
    "clearData": () => dispatch(clearExecutionList())
});

export const ExecutionList = connect(
    mapStateToProps,
    mapDispatchToProps)
(ExecutionListContainer);