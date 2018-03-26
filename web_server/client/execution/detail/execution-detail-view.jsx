import React from "react";
import {connect} from "react-redux";
import {fetchExecution, clearExecution} from "./../execution-action";
import {executionDetailSelector} from "./../execution-reducer";
import {LoadingIndicator} from "./../../components/loading-indicator";
import {isLoadingSelector, dataSelector} from "./../../service/repository";
import {isExecutionFinished} from "./../execution-api";
import {Tabs} from "./../../components/tab";
import {toggleSelection, clearSelection} from "./execution-detail-action";
import {sharedSelectionSelector} from "./execution-detail-reducer";
import {destroyFilter} from "./../../components/filter/filter-action";
import {destroyMethods} from "./../../dashboard/score-item-list/score-item-list-action";
import {BenchmarkTab} from "./../../execution-detail/benchmark/benchmark-tab";
import {GeneralTab} from "./../../execution-detail/general/general-tab";
import {ManagementTab} from "./../../execution-detail/management/management-tab";
import {ScoreTab} from "./../../execution-detail/score/score-tab";

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
                <GeneralTab execution={execution}
                            label={"Overview"}
                            enabled={true}/>
                <ManagementTab execution={execution}
                               label={"Management"}
                               enabled={isFinished}/>
                <ScoreTab execution={execution}
                          label={"Results"}
                          enabled={isFinished}/>
                <BenchmarkTab execution={execution}
                              label={"Benchmark"}
                              enabled={isFinished}/>

            </Tabs>
        );

        // return (
        //         <ScoreItemListDashboard
        //             execution={execution}
        //             label={"Results list"}
        //             enabled={isFinished}
        //             selection={this.props.selection}
        //             onToggleSelection={this.props.toggleSelection}/>
        //         <ScoreItemDetailDashboard
        //             execution={execution}
        //             label={"Selection detail"}
        //             enabled={isFinished}
        //             selection={this.props.selection}
        //             onToggleSelection={this.props.toggleSelection}/>
        //         <SimilarityHistogramDashboard
        //             execution={execution}
        //             label={"Similarity histogram"}
        //             enabled={isFinished}
        //             selection={this.props.selection}
        //             onToggleSelection={this.props.toggleSelection}/>
        // )
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
            // TODO Properly clearup
            dispatch(clearExecution(id));
            // dispatch(clearOutputs());
            dispatch(destroyFilter("base-dashboard"));
            dispatch(destroyMethods());
            dispatch(clearSelection());
        },
        "toggleSelection": (item) => dispatch(toggleSelection(item)),

    }))
(ExecutionDetail);