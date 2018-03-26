import React from "react";
import {Container} from "reactstrap";
import {ScoreListTable} from "./score-list-table";
import {OutputArrayDashboard} from "./../../../dashboard/output-array-dashboard";

export class ScoreItemList extends React.Component {

    render () {
        const style = {
            // "border": "1px solid black",
            "margin": "1REM",
            "padding": "1REM"
        };
        // TODO Move container to OutputArrayDashboard ?
        return (
            <Container fluid={true} style={style}>
                <OutputArrayDashboard
                    execution={this.props.execution}
                    component={ScoreListTable}
                    selection={this.props.selection}
                    onToggleSelection={this.props.onToggleSelection}
                    filtersId={"score-item-list"}
                    outputName="scores.json"
                    runName={this.props.runName}
                    />
            </Container>
        )
    }

}
