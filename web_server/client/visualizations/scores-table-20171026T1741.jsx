import React from "react";
import {Col, Row} from "reactstrap";
import {connect} from "react-redux";
import {
    selectOutputLoading,
    selectOutputData
} from "./../execution/execution-reducer";
import {fetchOutput, clearOutputs} from "./../execution/execution-action";
import {LoadingIndicator} from "./../components/loading-indicator";
import {PropTypes} from "prop-types";
import {applyFilters, FilterComponent} from "./../visualizations/filter";

/**
 * Visualisation of a single output file.
 */
const ColumnWithTable = ({scores, highlight, onClick}) => (
    <table style={{"border": "1px solid black"}}>
        <tbody>
        <tr>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "10rem"
            }}>
                Name
            </th>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "6rem"
            }}>
                Similarity
            </th>
            <th style={{
                "textAlign": "center",
                "border": "1px solid black",
                "width": "6rem"
            }}>
                Order
            </th>
        </tr>
        {scores.data.map((value, index) => {
            const style = {};
            if (value.id === highlight) {
                style["backgroundColor"] = "#FFFDBA";
            }
            return (
                <tr key={index}
                    style={style}
                    onClick={() => onClick(value.id)}>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.id}
                    </td>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.value.toFixed(4)}
                    </td>
                    <td style={{
                        "textAlign": "center",
                        "border": "1px solid black"
                    }}>
                        {value.order}
                    </td>
                </tr>
            )
        })}
        </tbody>
    </table>
);

/**
 * Container for visualisation of single output.
 */
class OutputTable extends React.Component {

    componentWillMount() {
        this.props.fetchData();
    }

    render() {
        if (this.props.isLoading) {
            return (
                <LoadingIndicator/>
            )
        }
        const {filter, outputData, active, onSetActive} = this.props;
        const data = applyFilters(outputData, filter);
        return (
            <ColumnWithTable
                scores={data}
                highlight={active}
                onClick={onSetActive}
            />
        );
    }

}

export const OutputTableContainer = connect(
    (state, ownProps) => ({
        "isLoading": selectOutputLoading(
            state, ownProps.fileName, ownProps.methodId),
        "outputData": selectOutputData(
            state, ownProps.fileName, ownProps.methodId)
        // TODO Add method detail.
    }),
    (dispatch, ownProps) => ({
        "fetchData": () => dispatch(fetchOutput(
            ownProps.executionId,
            ownProps.methodId,
            ownProps.fileName
        ))
    }))(OutputTable);

OutputTableContainer.propTypes = {
    "filter": PropTypes.any.isRequired,
    "active": PropTypes.any, // TODO isRequired - introduce some empty value
    // TODO Create single object reference for output.
    "fileName": PropTypes.string.isRequired,
    "executionId": PropTypes.string.isRequired,
    "methodId": PropTypes.string.isRequired,
    "onSetActive": PropTypes.func.isRequired
};

/**
 * Put together Filter and visualizations components for each method.
 */
class ScoresTable extends React.Component {

    constructor(props) {
        super(props);
        this.onSetActive = this.onSetActive.bind(this);
    }

    componentWillMount() {
        this.setState({"active": undefined});
    }

    onSetActive(id) {
        // TODO Move to store if it does not cause performance penalty.
        if (this.state.active === id) {
            this.setState({"active": undefined});
        } else {
            this.setState({"active": id});
        }
    }

    render() {
        const {methodsId, filter, fileName, executionId} = this.props;
        return (
            <div>
                <h5>Filters</h5>
                <FilterComponent data={filter}/>
                <h5>Scores</h5>
                <Row>
                    {
                        methodsId.map((key) => (
                            <Col key={key}>
                                <OutputTableContainer
                                    filter={filter}
                                    active={this.state.active}
                                    fileName={fileName}
                                    executionId={executionId}
                                    methodId={key}
                                    onSetActive={this.onSetActive}
                                />
                            </Col>
                        ))
                    }
                </Row>
            </div>
        );
    }

    componentWillUnmount() {
        this.props.clearOutputs();
    }

}

const mapStateToProps = (state, ownProps) => ({
    "filter": [
        {"name": "topN", "n": 20},
        {"name": "valueGreaterThen", "key": "value", "value": 0.5}
    ]
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    "clearOutputs": () => dispatch(clearOutputs)
});

export const ScoresTableContainer = connect(
    mapStateToProps, mapDispatchToProps)(ScoresTable);

ScoresTableContainer.propTypes = {
    "fileName": PropTypes.string.isRequired,
    "executionId": PropTypes.string.isRequired,
    "methodsId": PropTypes.arrayOf(PropTypes.string).isRequired
};
