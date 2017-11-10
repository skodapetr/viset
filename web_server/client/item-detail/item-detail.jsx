import React from "react";
import {PropTypes} from "prop-types";
import {connect} from "react-redux";
import {selectDetailData} from "./../method/method-reducer";

class ItemDetailComponent extends React.Component {

    render() {
        if (this.props.selection.id === undefined) {
            return (
                <div>
                    <br/>
                    <b>No molecule selected.</b>
                </div>
            )
        }
        // TODO Extract to other function / selector ?
        const details = [];
        for (let index in this.props.methodsId) {
            const key = this.props.methodsId[index];
            const outputName = key + "/scores.json";
            const method = this.props.methods[key];
            const outputs = this.props.outputs[outputName];
            if (method === undefined || outputs === undefined) {
                continue;
            }
            details.push({
                "label": method["metadata"]["label"],
                "detail": this.selectOutput(
                    outputs.data, this.props.selection.id)
            });
        }
        //
        return (
            <div>
                <br/>
                <p>
                    <b>Molecule</b>: {this.props.selection.id}
                </p>
                {
                    details.map((value) => (
                        <div key={value.label} style={{"marginTop": "1rem"}}>
                            <b>{value.label}</b>
                            <div style={{"marginLeft": "2rem"}}>
                                <b>Score:</b> {value.detail.value}<br/>
                                <b>Order:</b> {value.detail.order}<br/>
                                <b>Most similar to:</b> {value.detail.query}<br/>
                            </div>
                        </div>
                    ))
                }
            </div>
        );
    }

    selectOutput(outputs, key) {
        for (let index in outputs) {
            const value = outputs[index];
            if (value.id === key) {
                return value;
            }
        }
        return undefined;
    }

}

export const ItemDetail = connect(
    (state, ownProps) => ({
        "outputs": state.execution.dashboard.outputs,
        "selection": state.execution.dashboard.selection,
        "methods": createMethodsList(state, ownProps.methodsId)
    }),
    (dispatch, ownProps) => ({}))
(ItemDetailComponent);

// TODO Move to reducer as a selector.
function createMethodsList(state, ids) {
    const output = {};
    ids.forEach((id) => output[id] = selectDetailData(state, id))
    return output;
}
