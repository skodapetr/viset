import React from "react";
import {Container} from "reactstrap";
import {PropTypes} from "prop-types";
import {createExecutionSummary} from "./../../execution/execution-api";

const ExecutionDetail = ({execution}) => {
    const summary = createExecutionSummary(execution);
    // TODO Move to CSS file and import.
    const style = {
        "border": "1px solid black",
        "margin": "1REM",
        "padding": "1REM"
    };
    return (
        <Container fluid={true}
                   style={style}>
            <b>Execution: </b>
            {execution.label} {" ("} {execution.id} {")"}
            <br/>
            <b>Type: </b> {execution.type}
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
        </Container>
    )
};

class _GeneralTab extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ExecutionDetail execution={this.props.execution}/>
        )
    }

}

export const GeneralTab = _GeneralTab;

GeneralTab.propTypes = {
    "execution": PropTypes.object.isRequired
};