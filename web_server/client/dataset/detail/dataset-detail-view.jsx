import React from "react";
import {connect} from "react-redux";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {Tabs} from "./../../components/tab";

class DatasetDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // this.props.initialize(this.props.params.id);
    }

    render() {
        return (
            <div>DETAIL</div>
        );
    }

    componentWillUnmount() {
        //this.props.destroy(this.props.params.id);
    }

}

export const DatasetDetailView = connect(
    (state, ownProps) => ({
        // "execution": executionDetailSelector(state, ownProps.params.id),
        // "selection": sharedSelectionSelector(state)
    }),
    (dispatch, ownProps) => ({
        // "initialize": (id) => {
        //     dispatch(fetchExecution(id));
        // },
        // "destroy": (id) => {
        //     dispatch(clearExecution(id));
        //     dispatch(clearOutputs());
        //     dispatch(destroyFilter("base-dashboard"));
        //     dispatch(destroyMethods());
        //     dispatch(clearSelection());
        // },
        // "toggleSelection": (item) => dispatch(toggleSelection(item)),
        // "onDelete": () => {
        //     deleteExecution(ownProps.params.id).then(() => {
        //         dispatch(push("/execution"));
        //     });
        // }
    }))
(DatasetDetail);