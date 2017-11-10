import React from "react";
import {PropTypes} from "prop-types";
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip} from "recharts";

function createLabel(label) {
    const value = parseFloat(label) - 0.05;
    return value.toFixed(2) + " - " + label;
}

export class HistogramComponent extends React.Component {

    render() {
        const data = this.createHistogram(this.props.unfilteredData);
        return (
            <BarChart width={500} height={300} data={data}>
                <XAxis dataKey="label" type="category" padding={{"left": 10}}/>
                <YAxis type="number"/>
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

HistogramComponent.propTypes = {
    "unfilteredData": PropTypes.arrayOf(PropTypes.any).isRequired
};