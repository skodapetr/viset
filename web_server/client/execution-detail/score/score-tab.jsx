import React from "react";
import {connect} from "react-redux";
import {Container, FormGroup, Label, Input} from "reactstrap";
import {PropTypes} from "prop-types";
import {fetchExecutionMethodSummaries} from "../../execution/execution-action";
import {executionMethodSummarySelector} from "../../execution/execution-reducer";
import {Tabs} from "../../components/tab";
import {sharedSelectionSelector} from "./score-tab-reducer";
import {toggleSelection, clearSelection} from "./score-tab-action";
import {ScoreItemList} from "./score-list/score-list";
import {ScoreItemDetail} from "./score-detail/score-detail";
import {ScoreHistogram} from "./score-histogram/score-histogram";
import {dataSelector, isLoadingSelector} from "./../../service/repository";
import {LoadingIndicator} from "../../components/loading-indicator";

class RunSelector extends React.Component {

    render() {
        return (
            <FormGroup>
                <Label for="runSelector">Active run</Label>
                <Input type="select" name="select" id="runSelector"
                       value={this.props.run}
                       onChange={event => this.props.onSelectionChanged(event.target.value)}>
                    {
                        this.props.runs.map(run => (
                            <option key={run.dir_name} value={run.dir_name}>
                                {run.dataset + " " + run.selection + " " + run.group + " " + run.split}
                            </option>
                        ))
                    }
                </Input>
            </FormGroup>
        )
    }

}

class _ScoreTab extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialState();
        this.onChangeRun = this.onChangeRun.bind(this);
    }

    getInitialState() {
        return {
            "run": undefined,
            "runs": undefined,
            "loading": true
        };
    }

    componentWillMount() {
        this.props.loadSummaries();
    }

    componentWillReceiveProps(nextProps) {
        // TODO Check for changes.
        if (nextProps.execution.type == "default") {
            this.setState({
                "run" : "run-main",
                "loading" : false
            });
            return;
        }

        if (this.state.runs !== undefined) {
            return;
        }

        let runs = undefined;
        Object.values(nextProps.summaries).forEach((summary) => {
            if (isLoadingSelector(summary)) {
                return;
            }
            const data = dataSelector(summary);
            // All the runs should be the same.
            runs = data["runs"];
        });

        if (runs === undefined) {
            this.setState({
                "loading" : true
            });
        } else {
            this.setState({
                "run" : runs[0]["dir_name"],
                "runs": runs,
                "loading" : false
            });
        }
    }

    render() {
        const style = {
            "border": "0px solid black",
            "margin": "0.5REM",
            "padding": "0REM"
        };

        if (this.state.loading) {
            return (
                <LoadingIndicator/>
            )
        }

        // TODO Pass runName and fileName for each method - get from summaries.
        // TODO Remove selection and onToggleSelection from ScoreHistogram.
        return (
            <Container fluid={true} style={style}>
                { this.state.runs !== undefined ?
                    <RunSelector runs={this.state.runs}
                                 selected={this.state.run}
                                 onSelectionChanged={this.onChangeRun}/>
                    : ""}
                <Tabs>
                    <ScoreItemList
                        enabled={true}
                        execution={this.props.execution}
                        runName={this.state.run}
                        label="Results list"
                        selection={this.props.selection}
                        onToggleSelection={this.props.toggleSelection}/>
                    <ScoreItemDetail
                        enabled={true}
                        execution={this.props.execution}
                        runName={this.state.run}
                        label="Selection detail"
                        selection={this.props.selection}/>
                    <ScoreHistogram
                        enabled={true}
                        execution={this.props.execution}
                        runName={this.state.run}
                        label="Similarity histogram"
                        selection={this.props.selection}
                        onToggleSelection={this.props.toggleSelection}/>
                </Tabs>
            </Container>
        )
    }

    onChangeRun(newRun) {
        this.setState({"run" : newRun});
        this.props.clearSelection();
    }

}

export const ScoreTab = connect(
    (state, ownProps) => {
        const summaries = {};
        Object.keys(ownProps.execution.methods).map(methodId => {
            summaries[methodId] = executionMethodSummarySelector(state, methodId);
        });
        return {
            "summaries": summaries,
            "selection": sharedSelectionSelector(state)
        }
    },
    (dispatch, ownProps) => ({
        "loadSummaries": () => {
            dispatch(fetchExecutionMethodSummaries(ownProps.execution));
        },
        "toggleSelection": (item) => dispatch(toggleSelection(item)),
        "clearSelection": (item) => dispatch(clearSelection(item))
    }))
(_ScoreTab);

ScoreTab.propTypes = {
    "execution": PropTypes.object.isRequired
};