import React from "react";

class MethodOutputsComponent extends React.Component {
    render() {
        const {execution, method} = this.props;

        // TODO Extract constants to one place.
        if (execution.status !== "finished" || method === undefined) {
            return null;
        }

        const baseUrl = getOutputBaseUri(execution.execution, method["metadata"]["id"]);
        const outputs = method["user_interface"]["output"];
        return (
            <div>
                Outputs: {" "}
                {Object.entries(outputs).map(([key, value]) => (
                    <span key={key}>
                     <a href={baseUrl + key}>{value.label}</a>&nbsp;
                 </span>
                ))}
            </div>
        )
    }

}

function getOutputBaseUri(executionId, methodId) {
    return "/api/v1/resources/executions/" + executionId + "/" +
        methodId + "/output/"
}

export const MethodOutputs = MethodOutputsComponent;

