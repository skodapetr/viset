import React from "react";
import {Link} from "react-router";
import {addLoadingIndicator} from "./../../components/loading-indicator";
import {dateToString} from "./../../service/date"

// TODO User higher order function to construct items.

const QueuedExecutionItem = ({execution}) => (
    <div className="list-group-item flex-column align-items-start">
        {/* Extract as an execution link. */}
        <h5 className="mb-1">
            <Link to={"/execution/" + execution.id}>{execution.id}</Link>
        </h5>
        <p className="mb-1">
            Queued
        </p>
    </div>
);

const RunningExecutionItem = ({execution}) => (
    <div className="list-group-item flex-column align-items-start">
        <h5 className="mb-1">
            <Link to={"/execution/" + execution.id}>{execution.id}</Link>
        </h5>
        <p className="mb-1">
            Running
            <br/>
            {dateToString(execution.start)} - ...
        </p>
    </div>
);

const FailedExecutionItem = ({execution}) => (
    <div className="list-group-item flex-column align-items-start">
        <h5 className="mb-1">
            <Link to={"/execution/" + execution.id}>{execution.id}</Link>
        </h5>
        <p className="mb-1">
            Failed
            <br/>
            {dateToString(execution.start)} - {dateToString(execution.finish)}
        </p>
    </div>
);

const FinishedExecutionItem = ({execution}) => (
    <div className="list-group-item flex-column align-items-start">
        <h5 className="mb-1">
            <Link to={"/execution/" + execution.id}>{execution.id}</Link>
        </h5>
        <p className="mb-1">
            Finished
            <br/>
            {dateToString(execution.start)} - {dateToString(execution.finish)}
        </p>
    </div>
);

// TODO Introduce pagination
// TODO Add button https://reacttraining.com/react-router/web/example/basic
const ExecutionList = ({executions}) => (
    <div className="list-group">
        {executions.map((execution) => {
            const executionRecord = createExecutionListItem(execution);
            switch (executionRecord.status) {
                case 0:
                    return (
                        <QueuedExecutionItem
                            key={executionRecord.id}
                            execution={executionRecord}/>
                    );
                case 1:
                    return (
                        <RunningExecutionItem
                            key={executionRecord.id}
                            execution={executionRecord}/>
                    );
                case 2:
                    return (
                        <FailedExecutionItem
                            key={executionRecord.id}
                            execution={executionRecord}/>
                    );
                case 3:
                    return (
                        <FinishedExecutionItem
                            key={executionRecord.id}
                            execution={executionRecord}/>
                    );
                default:
                    console.error("Invalid execution: ", execution);
                    return null;
            }
        })}
    </div>
);

function createExecutionListItem(execution) {
    // TODO Add handling for no methods in execution.
    let start;
    let finish;
    let status;
    execution.methods.forEach((method) => {
        const methodStart = new Date(method.start);
        const methodFinish = new Date(method.finish);
        start = start === undefined ? methodStart :
            (methodStart < start ? methodStart : start);
        finish = finish === undefined ? methodFinish :
            (methodFinish > finish ? methodStart : finish);
        if (status === undefined) {
            status = statusToNumber(method.status);
        } else {
            // TODO Fix when there is one queued on other running this produce queued.
            status = Math.min(status, statusToNumber(method.status));
        }
    });
    return {
        "id": execution.id,
        "start": start,
        "finish": finish,
        "status": status
    };
}

// TODO Move to utility class?
function statusToNumber(status) {
    switch (status) {
        case "queued":
            return 0;
        case "running":
            return 1;
        case "failed":
            return 2;
        case "finished":
            return 3;
    }
}

export const ExecutionListComponent = addLoadingIndicator(ExecutionList);
