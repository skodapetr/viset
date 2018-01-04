import React from "react";
import {Container, Button} from "reactstrap";
import {createExecutionSummary} from "./../execution/execution-api";
import {isExecutionFinishedOrFailed} from "./../execution/execution-api";

export class ExecutionDetailDashboard extends React.Component {

    render() {
        const {execution} = this.props;
        const summary = createExecutionSummary(execution);
        const executionFinished = isExecutionFinishedOrFailed(execution);
        return (
            <Container fluid={true}
                       style={{
                           "border": "1px solid black",
                           "margin": "1REM",
                           "padding": "1REM"
                       }}>
                <b>Execution: </b>
                {execution.label} {" ("} {execution.id} {")"}
                <br/>
                <b>Status: </b> {summary.status}
                <br/>
                <b>Description: </b>
                {execution.description}
                <br/>
                <b>Methods:</b>
                {
                    Object.values(execution.methods).map((method) => (
                        <div style={{"marginLeft": "1REM"}} key={method.id}>
                            {method.label} {" : "} {method.status}
                        </div>
                    ))
                }
                <br/>
                {executionFinished &&
                <div>
                    <Button size="sm"
                            color="danger"
                            onClick={this.props.onDelete}>
                        Delete execution
                    </Button>
                </div>
                }
            </Container>
        )
    }

}
