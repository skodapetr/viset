import React from "react";
import {Link} from "react-router";
import {dateToString} from "./../../service/format";
import {createExecutionSummary} from "./../execution-api";

export const ExecutionItem = ({data}) => {
    const summary = createExecutionSummary(data);
    const statusComponent = createStatusComponent(summary);
    return (
        <div className="list-group-item flex-column align-items-start">
            <h5 className="mb-1">
                <Link to={"/execution/" + data.id}>{data.label}</Link>
            </h5>
            {statusComponent}
        </div>
    )
};

function createStatusComponent(status) {
    switch (status.status) {
        case "queued":
            return (
                <p className="mb-1">
                    Queued
                </p>
            );
        case "running":
            return (
                <p className="mb-1">
                    Running
                    <br/>
                    {dateToString(status.start)} - ...
                </p>
            );
        case "failed":
            return (
                <p className="mb-1">
                    Failed
                    <br/>
                    {dateToString(status.start)} - {dateToString(status.finish)}
                </p>
            );
        case "finished":
            return (
                <p className="mb-1">
                    Finished
                    <br/>
                    {dateToString(status.start)} - {dateToString(status.finish)}
                </p>
            );
        default:
            console.error("Invalid execution status: ", status);
            return null;
    }
}
