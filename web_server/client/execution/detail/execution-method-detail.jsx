import React from "react";
import {connect} from "react-redux";
import {MethodOutputs} from "./execution-method-outputs";
import {dateToString} from "./../../service/date"
import {fetchMethodDetail} from "./../../method/method-action"
import {selectDetailData} from "./../../method/method-reducer"

// TODO Reuse visual from execution list.
const QueuedMethod = ({execution, method}) => (
    <div>
        <b>{selectLabel(execution, method)}</b>
        <div style={{"marginLeft": "2rem"}}>
            Queued
        </div>
    </div>
);

function selectLabel(execution, method) {
    if (method === undefined) {
        return execution.id;
    }
    return method.metadata.label;
}

const RunningMethod = ({execution, method}) => (
    <div>
        <b>{selectLabel(execution, method)}</b>
        <div style={{"marginLeft": "2rem"}}>
            Running
            <br/>
            {dateToString(execution.start)}{" - ... "}
        </div>
    </div>
);

const FinishedMethod = ({execution, method}) => (
    <div>
        <b>{selectLabel(execution, method)}</b>
        <div style={{"marginLeft": "2rem"}}>
            Finished
            <br/>
            {dateToString(execution.start)}{" - "}{dateToString(execution.finish)}
            <br/>
            <MethodOutputs execution={execution} method={method}/>
        </div>
    </div>
);

// TODO Update to not include HTML styles.
class MethodExecution extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        const {execution, detail} = this.props;
        return (
            <div style={{"marginBottom": "1rem", "marginUp": "1rem"}}>
                {getComponentForExecution(execution, detail)}
            </div>
        );
    }

    componentWillUnmount() {
        this.props.clearData();
    }

}

// TODO Transform into a component and move to other file.
function getComponentForExecution(execution, method) {
    switch(execution.status) {
        case "queued":
            return (
                <QueuedMethod execution={execution} method={method} />
            );
        case "running":
            return (
                <RunningMethod execution={execution} method={method} />
            );
        case "finished":
            return (
                <FinishedMethod execution={execution} method={method} />
            );
        default:
            throw Error("Invalid state" +  execution.status);
    }
}

export const MethodExecutionDetail = connect(
    (state, ownProps) => ({
        "detail" : selectDetailData(state, ownProps.execution.id)
    }),
    (dispatch, ownProps) => ({
        "fetchData" : () => (dispatch(fetchMethodDetail(ownProps.execution.id)))

    }))
(MethodExecution);

