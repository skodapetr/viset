import React from "react";
import {connect} from "react-redux";
import {fetchExecution, clearExecution} from "./../execution-action";
import {executionDetailSelector} from "./../execution-reducer";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {ExecutionDetailDashboard} from "./../../dashboard/execution-detail";
import {ScoreItemListDashboard} from "./../../dashboard/score-item-list/score-item-list";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {isExecutionFinished, deleteExecution} from "./../execution-api";
import {Tabs} from "./../../components/tab";
import {ScoreItemDetailDashboard} from "./../../dashboard/score-item-detail";
import {toggleSelection, clearSelection} from "./execution-detail-action";
import {sharedSelectionSelector} from "./execution-detail-reducer";
import {clearOutputs} from "./../../output/output-action";
import {destroyFilter} from "./../../components/filter/filter-action";
import {destroyMethods} from "./../../dashboard/score-item-list/score-item-list-action";
import {SimilarityHistogramDashboard} from "./../../dashboard/similarity-histogram";
import {push} from "react-router-redux";

class ExecutionDetail extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.initialize(this.props.params.id);
    }

    render() {
        const isLoading = isLoadingSelector(this.props.execution);
        if (isLoading) {
            return (
                <div>
                    <LoadingIndicator/>
                </div>
            )
        }
        const execution = dataSelector(this.props.execution);
        const isFinished = isExecutionFinished(execution);
        return (
            <Tabs>
                <ExecutionDetailDashboard
                    execution={execution}
                    label={"Details"}
                    enabled={true}
                    onDelete={this.props.onDelete}/>
                <ScoreItemListDashboard
                    execution={execution}
                    label={"Results list"}
                    enabled={isFinished}
                    selection={this.props.selection}
                    onToggleSelection={this.props.toggleSelection}/>
                <ScoreItemDetailDashboard
                    execution={execution}
                    label={"Selection detail"}
                    enabled={isFinished}
                    selection={this.props.selection}
                    onToggleSelection={this.props.toggleSelection}/>
                <SimilarityHistogramDashboard
                    execution={execution}
                    label={"Similarity histogram"}
                    enabled={isFinished}
                    selection={this.props.selection}
                    onToggleSelection={this.props.toggleSelection}/>
            </Tabs>
        );
    }

    componentWillUnmount() {
        this.props.destroy(this.props.params.id);
    }

}

export const ExecutionDetailView = connect(
    (state, ownProps) => ({
        "execution": executionDetailSelector(state, ownProps.params.id),
        "selection": sharedSelectionSelector(state)
    }),
    (dispatch, ownProps) => ({
        "initialize": (id) => {
            dispatch(fetchExecution(id));
        },
        "destroy": (id) => {
            dispatch(clearExecution(id));
            dispatch(clearOutputs());
            dispatch(destroyFilter("base-dashboard"));
            dispatch(destroyMethods());
            dispatch(clearSelection());
        },
        "toggleSelection": (item) => dispatch(toggleSelection(item)),
        "onDelete": () => {
            deleteExecution(ownProps.params.id).then(() => {
                dispatch(push("/execution"));
            });
        }
    }))
(ExecutionDetail);