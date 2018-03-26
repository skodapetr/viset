import React from "react";
import {connect} from "react-redux";
import {isLoadingSelector, dataSelector} from "./../service/repository";
import {LoadingIndicator} from "./../components/loading-indicator";
import {PropTypes} from "prop-types";
import {
    Filter,
    filterDataSelector,
    filterMultipleLists
} from "./../components/filter";
import {DashboardLayout} from "./dahboard-layout";
import {fetchOutput} from "../execution/execution-action";
import {outputSelector} from "../execution/execution-reducer";

const ItemListDashboardTile = ({method, isLoading, data, Component, selection, onToggleSelection}) => (
    <div>
        <b>{method.label}</b><br/>
        { isLoading ?
            <LoadingIndicator/> :
            <Component
                id={method.id}
                data={data}
                selection={selection}
                onToggleSelection={onToggleSelection}/>
        }
    </div>
);

/**
 * Can be used only for finished executions.
 */
class ItemListDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.updateFilteredData = this.updateFilteredData.bind(this);
        this.state = this.getInitialState();
    }

    getInitialState() {
        return {};
    }

    componentWillMount() {
        this.props.fetchOutputs(this.props.runName);
        this.updateFilteredData(this.props);
    }

    componentWillReceiveProps(nextProps) {

        if (this.props.runName !== nextProps.runName) {
            this.props.fetchOutputs(nextProps.runName);
        }

        let outputsChanged = false;
        if (Object.keys(this.props.outputs).length ==
            Object.keys(nextProps.outputs).length) {
            Object.keys(this.props.outputs).forEach(key => {
                if (outputsChanged) {
                    return;
                }
                const nextOutput = nextProps.outputs[key];
                const thisOutput = this.props.outputs[key];
                outputsChanged = nextOutput !== thisOutput;
            });
        } else {
            outputsChanged = true;
        }

        const filterChanged = this.props.filter !== nextProps.filter;
        if (outputsChanged || filterChanged) {
            this.updateFilteredData(nextProps);
        }
    }

    render() {
        const {execution, outputs, selection, onToggleSelection} = this.props;
        return (
            <div>
                {this.props.useFilter &&
                <div>
                    <Filter id={this.props.filtersId} destroyOnUnmount={false}/>
                </div>
                }
                <DashboardLayout>
                    {Object.keys(execution.methods).map((key) => (
                        <ItemListDashboardTile
                            key={key}
                            isLoading={isLoadingSelector(outputs[createOutputKey(key)])}
                            method={execution.methods[key]}
                            data={this.state.filteredData[key]}
                            selection={selection}
                            Component={this.props.component}
                            onToggleSelection={onToggleSelection}
                        />
                    ))
                    }
                </DashboardLayout>
            </div>
        )
    }

    updateFilteredData(props) {
        const lists = [];
        Object.keys(props.execution.methods).forEach((method) => {
            const key = createOutputKey(method);
            const value = dataSelector(props.outputs[key]);
            if (value !== undefined) {
                lists[method] = value.data;
            }
        });

        let filteredData;
        if (props.useFilter) {
            filteredData = filterMultipleLists(props.filter, lists)
        } else {
            filteredData = lists;
        }
        this.setState({
            "filteredData": filteredData
        });
    }

}

// TODO Refactor, describe purpose, prepare for different run, fileNames ...
function createOutputKey(method) {
    return method + "scores.json";
}

export const OutputArrayDashboard = connect(
    (state, ownProps) => {
        // TODO Replace with access directly to the store.
        const outputs = {};
        console.log("Selecting data for:", ownProps.runName);
        Object.keys(ownProps.execution.methods).forEach((key) => {
            outputs[createOutputKey(key)] = outputSelector(
                state,
                ownProps.execution.id,
                key,
                ownProps.runName,
                ownProps.outputName);
        });
        return {
            "outputs": outputs,
            "filter": filterDataSelector(state, ownProps.filtersId),
            "useFilter": ownProps.filtersId !== undefined
        };
    },
    (dispatch, ownProps) => ({
        "fetchOutputs": (runName) => {
            // FETCH OUTPUTS FOR ALL METHODS
            Object.keys(ownProps.execution.methods).forEach((key) => {
                dispatch(fetchOutput(
                    ownProps.execution.id,
                    key,
                    runName,
                    ownProps.outputName));
            });
        }
    }))
(ItemListDashboard);

OutputArrayDashboard.propTypes = {
    "execution": PropTypes.object.isRequired,
    "component": PropTypes.func.isRequired,
    "selection": PropTypes.array.isRequired,
    "onToggleSelection": PropTypes.func.isRequired,
    "filtersId": PropTypes.string,
    "outputName": PropTypes.string,
    "runName": PropTypes.string
};