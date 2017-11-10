import React from "react";
import {connect} from "react-redux";
import {clearMethodList, fetchMethodList} from "./../method-action";
import {selectListLoading, selectListData} from "./../method-reducer";
import {Link} from "react-router";
import {addLoadingIndicator} from "./../../components/loading-indicator";

// TODO Add property specification.
const MethodItem = ({method}) => (
    <div className="list-group-item flex-column align-items-start">
        <h5 className="mb-1">
            <Link to={"/method/" + method.id}>{method.label}</Link>
        </h5>
        <p className="mb-1">
            {method.description}
        </p>
    </div>
);

// TODO Add property specification.
const MethodListComponent = addLoadingIndicator(({methods}) => (
    <div className="list-group">
        {methods.map((method) => (
            <MethodItem key={method.id} method={method}/>
        ))}
    </div>
));

// TODO Add auto refresh functionality.
class MethodListContainer extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const {loading, methods} = this.props;
        return (
            <MethodListComponent isLoading={loading} methods={methods}/>
        );
    }

    componentWillUnmount() {
        this.props.clearData();
    }

}

export const MethodList = connect(
    (state, ownProps) => ({
        "loading": selectListLoading(state),
        "methods": selectListData(state)
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchMethodList()),
        "clearData": () => dispatch(clearMethodList())
    }))
(MethodListContainer);