import React from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {fetchMethodDetail} from "./../method/method-action";
import {selectDetailData} from "./../method/method-reducer";
import {Tile} from "./tile";
import {
    fetchOutput,
    openFilterDialog,
    deleteFilter,
    closeFilterDialog,
    updateFilter,
    updateSelection
} from "./../execution/execution-action";
import {selectFilterDialogData} from "./../execution/execution-reducer";
import {Row, Col} from "reactstrap";
import {Filter} from "./filter";

class Dashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.props.fetchMethodDetails();
        // TODO New methods can be added, we should monitor that and made request for additional definitions.
    }

    render() {
        if (this.props.methodsId.length === 0) {
            return (
                <div>
                    No results to visualize.
                </div>
            );
        }
        const visualizationComponent = this.props.component;
        return (
            <div>
                {
                    this.props.showFilter &&
                    <div style={{"marginTop": "1rem"}}>
                        <Filter data={this.props.filter}
                                editItem={this.props.editItem}
                                removeItem={this.props.removeItem}
                                addItem={this.props.addItem}
                                isOpen={this.props.isOpen}
                                filterDialog={this.props.filterDialog}
                                saveDialog={this.props.saveDialog}
                                cancelDialog={this.props.cancelDialog}/>
                    </div>
                }
                <Row style={{"marginTop": "1rem"}}>
                    {this.props.methodsId.map((id) => (
                        <Col key={id}>
                            <Tile selection={this.props.selection}
                                  method={this.props.methods[id]}
                                  data={selectData(this.props.outputs[createKey(id)])}
                                  filteredData={this.props.filteredOutput[createKey(id)]}
                                  changeSelection={this.props.changeSelection}
                                  component={visualizationComponent}
                            />
                        </Col>
                    ))}
                </Row>
            </div>
        );

    }

}

// TODO Change to selector in a reducer.
function selectData(data) {
    if (data === undefined) {
        return undefined;
    }
    return data.data;
}

// TODO Move as a selector to reducer.
function createKey(methodId) {
    return methodId + "/" + "scores.json";
}

export const DashboardContainer = connect(
    (state, ownProps) => ({
        "filter": state.execution.dashboard.filter,
        "outputs": state.execution.dashboard.outputs,
        "selection": state.execution.dashboard.selection,
        "filteredOutput": state.execution.dashboard.filteredOutputs,
        "methods": createMethodsList(state, ownProps.methodsId),
        "filterDialog": selectFilterDialogData(state)
    }),
    (dispatch, ownProps) => ({
        "fetchMethodDetails": () => {
            for (let index in ownProps.methodsId) {
                const id = ownProps.methodsId[index];
                dispatch(fetchMethodDetail(id));
                // TODO Move somewhere else, ie fetch outputs here ?
                dispatch(fetchOutput(ownProps.executionId, id, "scores.json"));
            }
        },
        "editItem": (index) => {
            dispatch(openFilterDialog(index));
        },
        "removeItem": (index) => {
            dispatch(deleteFilter(index));
        },
        "addItem": () => {
            dispatch(openFilterDialog(-1, undefined));
        },
        "saveDialog": (index, data) => {
            dispatch(updateFilter(index, data));
            dispatch(closeFilterDialog());
        },
        "cancelDialog": () => {
            dispatch(closeFilterDialog());
        },
        "changeSelection": (selection) => {
            dispatch(updateSelection(selection));
        }
    }))
(Dashboard);

// TODO Move to reducer as a selector.
function createMethodsList(state, ids) {
    const output = {};
    ids.forEach((id) => output[id] = selectDetailData(state, id))
    return output;
}

DashboardContainer.propTypes = {
    "executionId": PropTypes.string.isRequired,
    "methodsId": PropTypes.arrayOf(PropTypes.string).isRequired
};

