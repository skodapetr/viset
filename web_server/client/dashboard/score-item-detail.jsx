import React from "react";
import {connect} from "react-redux";
import {fetchOutput} from "./../output/output-action";
import {outputsDetailSelector} from "./../output/output-reducer";
import {PropTypes} from "prop-types";
import {dataSelector} from "./../service/repository";
import {Container} from "reactstrap";
import {executionMethodSelection} from "../execution/execution-reducer";

const PropertyMap = ({data}) => (
    <div style={{"marginLeft": "2REM"}}>
        <b>Score:</b> {data.value}<br/>
        <b>Order:</b> {data.order}<br/>
        <b>Most similar to:</b> {data.query}<br/>
    </div>
);

const SelectedItemDetail = ({id, execution, outputs}) => (
    <div style={{
        "border": "1px solid gray",
        "margin": "1REM",
        "padding": "1REM"
    }}>
        <b>Molecule: </b> {id} <br/>
        {Object.values(execution.methods).map((method) => (
            <div key={method.id} style={{"marginLeft": "2REM"}}>
                <b>Method: </b> {method.label} <br/>
                <PropertyMap data={outputs[createOutputKey(execution, method.id)]}/>
            </div>
        ))}
    </div>
);

export class ScoreItemDetail extends React.Component {

    constructor(props) {
        super(props);
        this.selectInfoForItem = this.selectInfoForItem.bind(this);
    }

    componentWillMount() {
        this.props.initialize();
    }

    render() {
        console.log(">", this.props.summaries);
        console.time("ScoreItemDetail.prepare");
        const selection = this.props.selection;
        const data = selection.map((key) => this.selectInfoForItem(key));
        console.timeEnd("ScoreItemDetail.prepare");
        return (
            <Container fluid={true}
                       style={{
                           "border": "1px solid black",
                           "margin": "1REM",
                           "padding": "1REM"
                       }}>
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
        return data;
    }

}

ScoreItemDetail.propTypes = {
    "execution": PropTypes.any.isRequired,
    "selection": PropTypes.array.isRequired,
    "onToggleSelection": PropTypes.func.isRequired
};

export const ScoreItemDetailDashboard = connect(
    (state, ownProps) => {
        let isLoaded = true;
        const summaries = {};
        Object.keys(ownProps.execution.methods).map(methodId => {
            summaries[methodId] = executionMethodSelection(state, methodId);
        });
        return {
            "outputs": outputsDetailSelector(state),
            "summaries": summaries
        }
    },
    (dispatch, ownProps) => ({
        "initialize": () => {
            Object.keys(ownProps.execution.methods).forEach((key) => {
                const ref = createReference(ownProps.execution, key);
                dispatch(fetchOutput(ref));
            });
        }
    }))
(ScoreItemDetail);

// TODO Move to output API.
function createReference(execution, method) {
    return {
        "execution": execution.id,
        "method": method,
        "output": "scores.json"
    };
}

// TODO Move to output API.
function createOutputKey(execution, method) {
    return execution.id + method + "scores.json";
}