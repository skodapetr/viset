import React from "react";
import {PropTypes} from "prop-types";
import {BaseDashboard} from "./base-dashboard";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

class HistogramComponent extends React.Component {

    constructor(props) {
        super(props);
        this.createHistogram = this.createHistogram.bind(this);
    }

    render() {
        const data = this.createHistogram(this.props.data);
        return (
            <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="label" type="category" padding={{"left": 10}}/>
                <YAxis type="number" domain={[0, this.props.data.length]}/>
                <CartesianGrid strokeDasharray="3 3"/>
                <Tooltip labelFormatter={createLabel}/>
                <Bar dataKey="count" fill="#8884d8"/>
            </BarChart>
        )
    }

    createHistogram(data) {
        const histogram = [];
        for (let index = 0; index < 20; ++index) {
            const labelValue = (index + 1) * 0.05;
            histogram.push({
                "label": labelValue.toFixed(2),
                "count": 0
            })
        }
        const step = 1.0 / 20;
        for (let index in data) {
            const value = data[index].value;
            const pocketIndex = Math.ceil(value / step) - 1;
            histogram[pocketIndex].count += 1;
        }
        return histogram;
    }

}

function createLabel(label) {
    const value = parseFloat(label) - 0.05;
    return value.toFixed(2) + " - " + label;
}

HistogramComponent.propTypes = {
    "data": PropTypes.array.isRequired
};

export const SimilarityHistogramDashboard = (props) => {
    const {execution, selection, onToggleSelection} = props;
    return (
        <BaseDashboard
            execution={execution}
            component={HistogramComponent}
            selection={selection}
            onToggleSelection={onToggleSelection}/>
    )
};


