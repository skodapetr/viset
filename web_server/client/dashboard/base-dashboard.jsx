import React from "react";
import {connect} from "react-redux";
import {Container} from "reactstrap";
import {fetchOutput} from "./../output/output-action";
import {outputsDetailSelector} from "./../output/output-reducer";
import {isLoadingSelector, dataSelector} from "./../service/repository";
import {LoadingIndicator} from "./../components/loading-indicator";
import {PropTypes} from "prop-types";
import {
    Filter,
    filterDataSelector,
    filterMultipleLists
} from "./../components/filter";
import {DashboardLayout} from "./dahboard-layout";

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
        this.props.initialize();
        this.updateFilteredData(this.props);
    }

    componentWillReceiveProps(nextProps) {
        const dataChanged = this.props.outputs !== nextProps.outputs || this.props.filter !== nextProps.filter;
        if (dataChanged) {
            this.updateFilteredData(nextProps);
        }
    }

    render() {
        const {execution, outputs, selection, onToggleSelection} = this.props;
        const style = {
            "border": "1px solid black",
            "margin": "1REM",
            "padding": "1REM"
        };
        return (
            <Container fluid={true} style={style}>
                {this.props.useFilter &&
                <div>
                    <Filter id={this.props.filtersId} destroyOnUnmount={false}/>
                </div>
                }
                <DashboardLayout>
                    {Object.keys(execution.methods).map((key) => (
                        <ItemListDashboardTile
                            key={key}
                            isLoading={isLoadingSelector(outputs[createOutputKey(this.props.execution, key)])}
                            method={execution.methods[key]}
                            data={this.state.filteredData[key]}
                            selection={selection}
                            Component={this.props.component}
                            onToggleSelection={onToggleSelection}
                        />
                    ))
                    }
                </DashboardLayout>
            </Container>
        )
    }

    updateFilteredData(props) {
        const lists = [];
        Object.keys(props.execution.methods).forEach((method) => {
            const key = createOutputKey(this.props.execution, method);
            const value = dataSelector(props.outputs[key]);
            if (value !== undefined) {
                lists[method] = value.data;
            }
        });

        if (props.useFilter) {
            this.setState({
                "filteredData": filterMultipleLists(props.filter, lists)
            });
        }  else {
            this.setState({
                "filteredData": lists
            });
        }
    }

}

// TODO Move to output API as a factory function.
function createOutputKey(execution, method) {
    return execution.id + method + "scores.json";
}

// TODO Move to output API.
function createReference(execution, method) {
    return {
        "execution": execution.id,
        "method": method,
        "output": "scores.json"
    };
}

export const BaseDashboard = connect(
    (state, ownProps) => ({
        // "outputs": outputsDetailSelector(state),
        "filter": filterDataSelector(state, ownProps.filtersId),
        "useFilter" : ownProps.filtersId !== undefined
    }),
    (dispatch, ownProps) => ({
        "initialize": () => {
            // FETCH OUTPUTS FOR ALL METHODS
            // Object.keys(ownProps.execution.methods).forEach((key) => {
            //     const ref = createReference(ownProps.execution, key);
            //     dispatch(fetchOutput(ref));
            // });
        }
    }))
(ItemListDashboard);

BaseDashboard.propTypes = {
    "execution": PropTypes.object.isRequired,
    "component": PropTypes.func.isRequired,
    "selection": PropTypes.array.isRequired,
    "onToggleSelection": PropTypes.func.isRequired,
    "filtersId": PropTypes.string
};