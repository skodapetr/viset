import React from "react";
import {connect} from "react-redux";
import {fetchMethodDetail, clearMethodsDetail} from "./../method-action";
import {selectDetailLoading, selectDetailData} from "./../method-reducer";
import {addLoadingIndicator} from "./../../components/loading-indicator";

// TODO Add property specification.
const MethodDetailComponent = addLoadingIndicator(({method}) => (
    <div>
        <p><b>ID:</b> {method.metadata.id}</p>
        <p><b>Label:</b> {method.metadata.label}</p>
        <p><b>Description:</b> {method.metadata.description}</p>
    </div>
));

class MethodDetailContainer extends React.Component {

    componentDidMount() {
        // TODO Check if the data are not already loaded.
        this.props.fetchData(this.props.params.id);
    }

    render() {
        const {loading, method} = this.props;
        return (
            <MethodDetailComponent isLoading={loading} method={method}/>
        )
    }

    componentWillUnmount() {
        this.props.clearData();
    }

}

export const MethodDetail = connect(
    (state, ownProps) => ({
        "loading": selectDetailLoading(state, ownProps.params.id),
        "method": selectDetailData(state, ownProps.params.id)
    }),
    (dispatch, ownProps) => ({
        "fetchData": (id) => dispatch(fetchMethodDetail(id)),
        "clearData": () => dispatch(clearMethodsDetail())
    }))
(MethodDetailContainer);