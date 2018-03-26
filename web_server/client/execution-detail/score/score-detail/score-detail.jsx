import React from "react";
import {PropTypes} from "prop-types";
import {Container} from "reactstrap";
import {fetchOutput} from "../../../execution/execution-action";
import {outputSelector} from "../../../execution/execution-reducer";
import {connect} from "react-redux";
import {dataSelector} from "./../../../service/repository";

// TODO Extract to another file.
const SelectedItemDetail = ({id, execution, outputs}) => (
    <div style={{
        "margin": "1REM",
        "padding": "1REM"
    }}>
        <b>Molecule: </b> {id} <br/>
        {Object.values(execution.methods).map((method) => (
            <div key={method.id} style={{"marginLeft": "2REM"}}>
                <b>Method: </b> {method.label} <br/>
                <PropertyMap data={outputs[createOutputKey(method.id)]}/>
            </div>
        ))}
    </div>
);

// TODO Extract to another file.
const PropertyMap = ({data}) => (
    <div style={{"marginLeft": "2REM"}}>
        <b>Score:</b> {data.value}<br/>
        <b>Order:</b> {data.order}<br/>
        <b>Most similar to:</b> {data.query}<br/>
    </div>
);

export class _ScoreItemDetail extends React.Component {

    constructor(props) {
        super(props);
        this.selectInfoForItem = this.selectInfoForItem.bind(this);
    }

    componentWillMount() {
        this.props.fetchOutputs();
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.runName !== nextProps.runName) {
            this.props.fetchOutputs();
        }
    }

    render() {
        const selection = this.props.selection;
        const data = selection.map((key) => this.selectInfoForItem(key));
        // TODO Add message if selection is empty.
        return (
            <Container fluid={true}>
                {
                    data.map(item => (
                        <SelectedItemDetail
                            key={item.id}
                            execution={this.props.execution}
                            id={item.id}
                            outputs={item.outputs}
                        />
                    ))
                }
            </Container>
        )
    }

    selectInfoForItem(id) {
        const data = {
            "id": id,
            "outputs": {}
        };
        Object.keys(this.props.outputs).map((key) => {
            const output = dataSelector(this.props.outputs[key]).data;
            for (let index in output) {
                let item = output[index];
                if (item.id === id) {
                    data.outputs[key] = item;
                    break;
                }
            }
        });
        console.log("selectInfoForItem", data);
        return data;
    }

}

_ScoreItemDetail.propTypes = {
    "execution": PropTypes.any.isRequired,
    "selection": PropTypes.array.isRequired
};

// TODO Refactor, describe purpose, prepare for different run, fileNames ...
function createOutputKey(method) {
    return method + "scores.json";
}

export const ScoreItemDetail = connect(
    (state, ownProps) => {
        // TODO Replace with access directly to the store.
        const outputs = {};
        Object.keys(ownProps.execution.methods).forEach((key) => {
            outputs[createOutputKey(key)] = outputSelector(
                state,
                ownProps.execution.id,
                key,
                ownProps.runName,
                "scores.json");
        });
        return {
            "outputs": outputs
        }
    },
    (dispatch, ownProps) => ({
        "fetchOutputs": () => {
            // FETCH OUTPUTS FOR ALL METHODS
            Object.keys(ownProps.execution.methods).forEach((key) => {
                dispatch(fetchOutput(
                    ownProps.execution.id,
                    key,
                    ownProps.runName,
                    "scores.json"));
            });
        }
    }))
(_ScoreItemDetail);
